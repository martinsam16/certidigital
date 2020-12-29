import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Web3Service} from './service/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  accountNumber: any;
  show = true;
  totalCertificados = [];
  private certidigital: any;
  balance: any;

  receptor: string;
  hashFile: string;
  fechaEmision: string;
  fechaExpiracion: string;

  clear() {
    this.receptor = null;
    this.hashFile = null;
    this.fechaEmision = null;
    this.fechaExpiracion = null;
  }

  constructor(private web3: Web3Service, private cd: ChangeDetectorRef) {

    this.web3.checkAndInstantiateWeb3()
      .then((checkConn: any) => {
        if (checkConn === 'connected') {
          this.web3.loadBlockChainData()
            .then((accountData: any) => {
              this.accountNumber = accountData[0];
              this.web3.getEtherBalance(this.accountNumber)
                .then((data: any) => {
                  this.balance = Number(data).toFixed(2);
                  console.log(data);
                });
              this.web3.getContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.certidigital = contractRes;
                    this.certidigital.methods.certificadoCount()
                      .call()
                      .then(value => {
                        for (let i = 1; i <= value; i++) {
                          this.certidigital.methods.certificados(i)
                            .call()
                            .then(certificados => {
                              this.show = false;
                              this.totalCertificados.push(certificados);
                              this.cd.detectChanges();
                            });
                        }
                        this.show = false;
                      });
                  }
                });
            }, err => {
              console.log('account error', err);
            });
        }
      }, err => {
        alert(err);
      });
  }

  ngOnInit() {
  }

  certificar(): void {
    this.addCertificate(this.receptor, this.hashFile, this.fechaEmision, this.fechaExpiracion);
  }

  private addCertificate(receptor, hashFile, fechaEmision, fechaExpiracion) {
    this.show = true;
    this.certidigital.methods.crearCertificado(this.web3.toChecksumAddress(receptor), hashFile, fechaEmision, fechaExpiracion)
      .send({from: this.accountNumber})
      .once('receipt', (receipt) => {
        this.clear();
        this.totalCertificados.push(receipt.events.Certificar.returnValues._certificado);
        this.show = false;
      });
  }

}

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Web3Service} from './service/web3.service';
import {DatePipe} from '@angular/common';
import sha256 from 'crypto-js/sha256';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent implements OnInit {

  accountNumber: any;
  show = true;
  totalCertificados = [];
  private certidigital: any;
  balance: any;

  receptor: string;
  hashFile: string;
  fechaEmision: Date;
  fechaExpiracion: Date;
  searchText;

  clear() {
    this.receptor = null;
    this.hashFile = null;
    this.fechaEmision = null;
    this.fechaExpiracion = null;
  }

  constructor(private web3: Web3Service,
              private cd: ChangeDetectorRef,
              private datePipe: DatePipe) {

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
    this.addCertificate(this.receptor,
      this.hashFile,
      this.formatearFecha(this.fechaEmision),
      this.formatearFecha(this.fechaExpiracion));
  }

  private addCertificate(receptor, hashFile, fechaEmision, fechaExpiracion): void {
    this.show = true;
    this.certidigital.methods.crearCertificado(this.web3.toChecksumAddress(receptor), hashFile, fechaEmision, fechaExpiracion)
      .send({from: this.accountNumber})
      .once('receipt', (receipt) => {
        this.clear();
        this.totalCertificados.push(receipt.events.Certificar.returnValues._certificado);
        this.show = false;
      });
  }


  processFile(pdf: any): void {
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      if (event.target.readyState === FileReader.DONE) {
        const hash = sha256(reader.result);
        this.hashFile = hash.toString();
        console.log(hash.toString());
      }
    });
    reader.readAsDataURL(pdf.files[0]);
  }

  searchFile(pdf: any): void {
    this.show = true;
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      if (event.target.readyState === FileReader.DONE) {
        const hash = sha256(reader.result);
        this.searchText = hash.toString();
        this.show = false;
      }
    });
    reader.readAsDataURL(pdf.files[0]);
  }

  formatearFecha(fecha: Date) {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy');
  }
}

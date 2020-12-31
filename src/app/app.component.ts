import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Web3Service} from './service/web3.service';
import {DatePipe} from '@angular/common';
import sha256 from 'crypto-js/sha256';
import {MatSnackBar} from '@angular/material';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent implements OnInit {

  myAddress: any;
  show = true;
  soyOwner = false;
  totalCertificados = [];
  private certidigital: any;
  balance: any;

  receptor: string;
  hashFile: string;
  titulo: string;
  urlCover: string;
  fechaEmision: Date;
  fechaExpiracion: Date;

  clear() {
    this.titulo = null;
    this.receptor = null;
    this.hashFile = null;
    this.fechaEmision = null;
    this.fechaExpiracion = null;
  }

  constructor(private web3: Web3Service,
              private cd: ChangeDetectorRef,
              private datePipe: DatePipe,
              private snackBar: MatSnackBar) {

    this.web3.checkAndInstantiateWeb3()
      .then((checkConn: any) => {
        if (checkConn === 'connected') {
          this.web3.loadBlockChainData()
            .then((accountData: any) => {
              this.myAddress = accountData[0];
              this.web3.getEtherBalance(this.myAddress)
                .then((data: any) => {
                  this.balance = Number(data).toFixed(2);
                });
              this.web3.getContract()
                .then((contractRes: any) => {
                  if (contractRes) {
                    this.certidigital = contractRes;
                    this.verificarOwner();
                    this.changeAccount();
                    this.show = false;
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

  public changeAccount() {
    window.ethereum.on('accountsChanged', (accounts) => {
      console.log('accountsChanged');
      this.myAddress = accounts[0];
      window.location.reload();
    });
  }

  certificar(): void {
    this.addCertificate(this.receptor,
      this.titulo,
      this.hashFile,
      this.formatearFecha(this.fechaEmision),
      this.formatearFecha(this.fechaExpiracion),
      this.urlCover);
  }

  private addCertificate(receptor, titulo, hashFile, fechaEmision, fechaExpiracion, urlCover): void {
    this.show = true;
    this.certidigital.methods.crearCertificado(this.web3.toChecksumAddress(receptor),
      titulo,
      hashFile,
      fechaEmision,
      fechaExpiracion,
      urlCover)
      .send({from: this.myAddress})
      .once('receipt', (receipt) => {
        this.clear();
        this.show = false;
        console.log('receipt', receipt);
      });
  }

  private obtenerCertificado(hashFile: string): void {
    this.certidigital.methods.obtenerCertificado(hashFile)
      .call()
      .then(encontrado => {
        if (encontrado.emisor !== '0x0000000000000000000000000000000000000000') {
          this.openSnackBar('El certificado es válido');
          this.totalCertificados.push(encontrado);
        } else {
          this.openSnackBar('El certificado es inválido');
        }
      });
  }


  private verificarOwner(): void {
    this.certidigital.methods.getOwner()
      .call()
      .then(addresOwner => {
        if (this.myAddress === addresOwner) {
          this.soyOwner = true;
        }
      });
  }


  encriptarCertificado(event: any): void {
    const pdf = event.files[0];
    if (pdf) {
      this.show = true;
      const reader = new FileReader();
      reader.addEventListener('load', (e: any) => {
        if (e.target.readyState === FileReader.DONE) {
          const hash = sha256(reader.result);
          this.hashFile = hash.toString();
          this.show = false;
          console.log(hash.toString());
        }
      });
      reader.readAsDataURL(pdf);
    }
  }

  searchFile(event: any): void {
    const pdf = event.files[0];
    if (pdf) {
      this.show = true;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (e.target.readyState === FileReader.DONE) {
          const hash = sha256(reader.result);
          this.obtenerCertificado(hash.toString());
          this.show = false;
        }
      };
      reader.readAsDataURL(pdf);
    }

  }

  formatearFecha(fecha: Date) {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy');
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'x', {
      duration: 5000,
    });
  }
}

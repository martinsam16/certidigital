// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Certidigital {
  uint public certificadoCount = 0;

  struct Certificado {
    uint id;
    address emisor;
    address receptor;
    string hashFile;
    string fechaEmision;
    string fechaExpiracion;
  }

  //id, certificado
  mapping(uint => Certificado) public certificados;

  event Certificar(address indexed _from, address indexed _to, Certificado _certificado);

  function crearCertificado(address receptor,
    string memory hashFile,
    string memory fechaEmision,
    string memory fechaExpiracion)
  public payable returns (bool) {
    certificadoCount++;
    Certificado memory certificado = Certificado(certificadoCount, msg.sender, receptor, hashFile, fechaEmision, fechaExpiracion);
    certificados[certificadoCount] = certificado;
    emit Certificar(msg.sender, receptor, certificado);
    return true;
  }

  function obtenerCertificado(uint idCertificado) public view returns (Certificado memory){
    return certificados[idCertificado];
  }

}

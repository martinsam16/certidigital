// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

//TODO standardize
contract Certidigital {

  struct Certificado {
    string titulo;
    address emisor;
    address receptor;
    string fechaEmision;
    string fechaExpiracion;
    string urlCover;
  }

  //hash pdf - certificado
  mapping(string => Certificado) public certificados;
  address private owner;

  event Certificar(address indexed _from, address indexed _to, Certificado _certificado);


  modifier soloOwner() {
    require(msg.sender == owner, "Caller is not owner");
    _;
  }

  constructor() public {
    owner = msg.sender;
  }

  function crearCertificado(address receptor,
    string memory titulo,
    string memory hashFile,
    string memory fechaEmision,
    string memory fechaExpiracion,
    string memory urlCover)
  public soloOwner returns (bool) {
    //Verificar si existe
    Certificado memory certificado = Certificado(titulo, msg.sender, receptor, fechaEmision, fechaExpiracion, urlCover);
    certificados[hashFile] = certificado;
    emit Certificar(msg.sender, receptor, certificado);
    return true;
  }

  function obtenerCertificado(string memory hashFile) public view returns (Certificado memory){
    return certificados[hashFile];
  }

  function getOwner() external view returns (address) {
    return owner;
  }
}

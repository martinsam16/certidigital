// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Certidigital {

    struct Certificado {
        address emisor;
        string tituloCertificado;
    }

    mapping(address => Certificado) certificados;

    event Certificar(address indexed _from, address indexed _to, Certificado _certificado);

    function crearCertificado(address receptor, string memory tituloCertificado) public {
        Certificado memory certificado = Certificado(msg.sender, tituloCertificado);
        certificados[receptor] = certificado;
        emit Certificar(msg.sender, receptor, certificado);
    }

    function getCertificado(address direccion) public view returns (Certificado memory){
        return certificados[direccion];
    }

}

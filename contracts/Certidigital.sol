// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Certidigital {

    struct Certificado {
        address emisor;
        address receptor;
        string tituloCertificado;
        string fecha;
        string fechaExpiracion;
    }

    //id, certificado
    mapping(string => Certificado) certificados;

    event Certificar(address indexed _from, address indexed _to, Certificado _certificado);

    function crearCertificado(address receptor, string memory idCertificado, string memory tituloCertificado, string memory fecha, string memory fechaExpiracion) public
    returns (Certificado memory) {
        Certificado memory certificado = Certificado(msg.sender, receptor, tituloCertificado, fecha, fechaExpiracion);
        certificados[idCertificado] = certificado;
        emit Certificar(msg.sender, receptor, certificado);
        return certificado;
    }

    function eliminarCertificado(string memory idCertificado) public {
        delete certificados[idCertificado];
    }

    function getCertificado(string memory idCertificado) public view returns (Certificado memory){
        return certificados[idCertificado];
    }

}
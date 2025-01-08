public with sharing class apex_ejercicio {
    @AuraEnabled(cacheable=true)
    public static List<motos__c> getallmotos(string textobusqueda) {
        string value = '%' + textobusqueda + '%'; //Cuando se usa '%' quiere decir que da igual lo que venga antes o despues del string
        return [
            SELECT marca__c, nombre__c, cilindraje__c, imagen_url__c, potencia__c, torque__c, peso__c, cantidad_de_cilindros__c
            FROM motos__c //el nombre del objeto que cree en la web de salesforce
            WHERE marca__c
            LIKE : value //La sentencia LIKE se usa para filtrar,
        ];
    }
}
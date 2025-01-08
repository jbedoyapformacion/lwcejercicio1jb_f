public with sharing class lwc_clase_Libreria_shg {
    @AuraEnabled(cacheable=true)
    public static List<Tabla_Libreria_shg__c> getlibros() {
        return [
            SELECT Id, Name, Sinopsis__c, Autor__c, Fecha_de_publicacion__c, Genero__c, Numero_de_copias__c, Reordenar__c
            FROM Tabla_Libreria_shg__c
        ];
    }

    @AuraEnabled
    public static void updateRecord(Map<String, Object> updatedRecord) {
        Tabla_Libreria_shg__c recordToUpdate = new Tabla_Libreria_shg__c();
        recordToUpdate.Id = (String)updatedRecord.get('Id');

        if (updatedRecord.containsKey('Numero_de_copias__c')) {
            recordToUpdate.Numero_de_copias__c = Integer.valueOf((String)updatedRecord.get('Numero_de_copias__c'));
        }

        List<Tabla_Libreria_shg__c> recordsToUpdate = new List<Tabla_Libreria_shg__c>();
        recordsToUpdate.add(recordToUpdate);
        update recordsToUpdate;
    }
}
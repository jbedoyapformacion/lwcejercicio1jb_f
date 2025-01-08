public with sharing class librosdemo {
    @AuraEnabled(cacheable=true)
    public static List<estantelibro__c> getLibros() {
        try {
            
            return [
                SELECT Id,  Name, Sinopsis__c, Autor__c, Fecha_de_publicacion__c, Genero__c, Numero_de_copias__c, Reordenar__c
                FROM    estantelibro__c
                LIMIT 100 
            ];
        } catch (Exception e) {
            // Manejo de errores
            System.debug('Error al obtener los libros: ' + e.getMessage());
            return new List<estantelibro__c>();
        }
    }

    @AuraEnabled 
    public static void updateRecord(Map<String, Object> updatedRecord) { 
        try {
            // Validación de la entrada: Verifica que la entrada tenga un 'Id' y 'Numero_de_copias__c'
            if (updatedRecord == null || !updatedRecord.containsKey('Id') || !updatedRecord.containsKey('Numero_de_copias__c')) {
                throw new IllegalArgumentException('Faltan parámetros requeridos');
            }
            
            // Obtener el ID del registro
            String recordId = (String)updatedRecord.get('Id');
            Integer numeroDeCopias = (Integer)updatedRecord.get('Numero_de_copias__c');
            
            // Validar que los datos sean correctos antes de hacer la actualización
            if (String.isBlank(recordId) || numeroDeCopias == null) {
                throw new IllegalArgumentException('ID del libro o número de copias inválidos');
            }

            // Recuperar el registro de la base de datos
            estantelibro__c recordToUpdate = [SELECT Id, Numero_de_copias__c FROM estantelibro__c WHERE Id = :recordId LIMIT 1];

            // Modificar el campo del número de copias
            recordToUpdate.Numero_de_copias__c = numeroDeCopias;

            // Actualizar el registro
            Database.update(recordToUpdate, false); // `false` para permitir actualizaciones parciales en caso de errores

        } catch (Exception e) {
            // Manejo de errores
            System.debug('Error al actualizar el libro: ' + e.getMessage());
            throw new AuraHandledException('Hubo un error al actualizar el libro: ' + e.getMessage());
        }
    }
}

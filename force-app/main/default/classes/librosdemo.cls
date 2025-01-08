public with sharing class librosdemo {
    @AuraEnabled(cacheable=true)
    public static List<estantelibro__c> getLibros() {
        try {
            
            return [
                SELECT Id, Name, Sinopsis__c, Autor__c, Fecha_de_publicacion__c, Genero__c, Numero_de_copias__c, Reordenar__c
                FROM estantelibro__c
                LIMIT 100 
            ];
        } catch (Exception e) {
            // Manejo de errores
            System.debug('Error al obtener los libros: ' + e.getMessage());
            return new List<estantelibro__c>();
        }
    }

    @AuraEnabled
public static void updateRecords(List<Map<String, Object>> updatedRecords) {
    try {
        // Validar que la lista no sea nula ni esté vacía
        if (updatedRecords == null || updatedRecords.isEmpty()) {
            throw new IllegalArgumentException('La lista de registros a actualizar no puede ser nula o vacía');
        }

        // Crear una lista para los registros que se van a actualizar
        List<estantelibro__c> recordsToUpdate = new List<estantelibro__c>();

        // Recorrer cada registro en la lista
        for (Map<String, Object> record : updatedRecords) {
            // Validar que el mapa no sea nulo y contenga las claves requeridas
            if (record == null || !record.containsKey('Id') ) {
                throw new IllegalArgumentException('Cada registro debe tener "Id"');
            }

            // Obtener el ID y el número de copias del registro
            String recordId = (String) record.get('Id');
            Integer numeroDeCopias = (Integer) record.get('Numero_de_copias__c');

            // Validar que los valores no sean nulos ni vacíos
            if (String.isBlank(recordId) ) {
                throw new IllegalArgumentException('ID del libro no debeser vacío');
            }

            // Recuperar el registro de la base de datos
            estantelibro__c existingRecord = [
                SELECT Numero_de_copias__c
                FROM estantelibro__c
                WHERE Id = :recordId
                LIMIT 1
            ];

            // Modificar el campo del número de copias
            existingRecord.Numero_de_copias__c = numeroDeCopias;

            // Agregar a la lista de actualizaciones
            recordsToUpdate.add(existingRecord);
        }

        // Actualizar todos los registros en una sola operación
        if (!recordsToUpdate.isEmpty()) {
            Database.update(recordsToUpdate, false); // `false` para permitir actualizaciones parciales
        }
    } catch (Exception e) {
        // Manejo de errores
        System.debug('Error al actualizar los libros: ' + e.getMessage());
        throw new AuraHandledException('Hubo un error al actualizar los libros: ' + e.getMessage());
    }
}

    
}
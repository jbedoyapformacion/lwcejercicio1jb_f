/**
 * @description       : clase ejercicio1 libreria de shg que incluye todos los metodos necesarios para la operacion de un solo libro
 * @author            : Jeffrey Bedoya
 * @group             : Netw
 * @last modified on  : 01-21-2025
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
//import { deleteRecord } from 'lightning/uiRecordApi';
public with sharing class librosdemo {
    @AuraEnabled(cacheable=true)
    public static List<estantelibro__c> getLibros() {
        try {
            return [
                SELECT Id, Name, Sinopsis__c, Autor__c, Fecha_de_publicacion__c, Genero__c, Numero_de_copias__c, Reordenar__c
                FROM estantelibro__c
                          ];
        } catch (Exception e) {
            // Manejo de errores
            System.debug('Error al obtener los libros: ' + e.getMessage());
            return new List<estantelibro__c>();
        }
    }

    @AuraEnabled
    public static void updateRecords(List<estantelibro__c> libros) {
        try {
            // Validar que la lista no sea nula ni esté vacía
            if (libros == null || libros.isEmpty()) {
                throw new IllegalArgumentException('La lista de registros a actualizar no puede ser nula o vacía');
            }      
            // Actualizar todos los registros en una sola operación
            if (!libros.isEmpty()) {
                update libros;  // Usamos `update` directamente para simplificar
            }
        } catch (Exception e) {
            // Manejo de errores
            System.debug('Error al actualizar l os libros: ' + e.getMessage());
            throw new AuraHandledException('Hubo un error al actualizar los libros: ' + e.getMessage());
        }
    }
    /*@AuraEnabled
    public static void deleteRecords(List<estantelibro__c> libros) {
             if (!libros.isEmpty()) {
                delete libros;  // Usamos `delete` directamente para simplificar
            }
        
    }*/
    
        @AuraEnabled
        public static void deleteRow(Id libro) {
            
            estantelibro__c[] eliminarlibro = [SELECT Id, Name FROM estantelibro__c 
            WHERE Id = :libro]; 
            try {
            delete eliminarlibro;
                } catch (DmlException e) {
// Process exception here
                }
            
        }
    
    

}
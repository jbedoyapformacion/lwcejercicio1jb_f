import { LightningElement, wire, track } from 'lwc';
import getLibros from '@salesforce/apex/librosdemo.getLibros';
/*import updateRecord from '@salesforce/apex/librosdemo.updateRecord';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';*/

export default class LibrosList extends LightningElement {
    @track libros = [];
    @track error;
    @track isLoading = false;

   
    columns = [
        { label: 'Nombre de estantelibro', fieldName: 'Name' },
        { label: 'Autor', fieldName: 'Autor__c' },
        { label: 'Sinopsis', fieldName: 'Sinopsis__c' },
        { label: 'Fecha de Publicación', fieldName: 'Fecha_de_publicacion__c' },
        { label: 'Género', fieldName: 'Genero__c' },
        { label: 'Número de Copias', fieldName: 'Numero_de_copias__c', type: 'number', editable: true },
        { label: 'Reordenar', fieldName: 'Reordenar__c', type: 'boolean', editable: false }
    ];

    // Cargar los libros desde el método Apex
    @wire(getLibros)
    wiredLibros({ error, data }) {
        if (data) {
            this.libros = data;
            this.error = undefined;
           console.log(data);
        } else if (error) {
            this.error = 'Error al cargar los libros: ' + error.body.message;
            this.libros = [];
        }
    }
}

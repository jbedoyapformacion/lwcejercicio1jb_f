import { LightningElement, wire, track } from 'lwc';
import getLibros from '@salesforce/apex/librosdemo.getLibros';
import updateRecord from '@salesforce/apex/librosdemo.updateRecord';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

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
        } else if (error) {
            this.error = 'Error al cargar los libros: ' + error.body.message;
            this.libros = [];
        }
    }

    // Manejar la acción de guardar los cambios en la tabla
    handleSave(event) {
        const draftValues = event.detail.draftValues;
        const updatedRecords = draftValues.map(draft => {
            return {
                Id: draft.Id,
                Numero_de_copias__c: draft.Numero_de_copias__c
            };
        });

        this.isLoading = true;

        // Llamada al método Apex para actualizar los registros
        updateRecord({ updatedRecord: updatedRecords })
            .then(() => {
                // Mostrar mensaje de éxito
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Éxito',
                        message: 'Libros actualizados correctamente',
                        variant: 'success',
                    })
                );
                this.isLoading = false;
                // Refrescar la lista de libros
                return refreshApex(this.libros);
            })
            .catch(error => {
                // Manejar el error
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error',
                        message: 'Hubo un problema al actualizar los libros: ' + error.body.message,
                        variant: 'error',
                    })
                );
                this.isLoading = false;
            });
    }
}

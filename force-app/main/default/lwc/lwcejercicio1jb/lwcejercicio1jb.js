import { LightningElement, wire, track } from 'lwc';
import getLibros from '@salesforce/apex/librosdemo.getLibros';
import updateRecords from '@salesforce/apex/librosdemo.updateRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class LibrosList extends LightningElement {
    @track libros = [];        // Almacena los datos obtenidos desde Apex
    @track draftValues = [];   // Almacena los valores editados
    @track error;              // Almacena errores

    columns = [
        { label: 'Nombre de estantelibro', fieldName: 'Name' },
        { label: 'Autor', fieldName: 'Autor__c' },
        { label: 'Sinopsis', fieldName: 'Sinopsis__c' },
        { label: 'Fecha de Publicación', fieldName: 'Fecha_de_publicacion__c' },
        { label: 'Género', fieldName: 'Genero__c' },
        { label: 'Número de Copias', fieldName: 'Numero_de_copias__c', type: 'number', editable: true },
        { label: 'Reordenar', fieldName: 'Reordenar__c', type: 'boolean', editable: false }
    ];

   
   @wire(getLibros)// aqui tenemos que el decorador retorna un getter , con la misma nomenclatura que para @wire
   libros;


    // === AQUÍ VIENE handleCellChange ===
    /**
     * Maneja los cambios realizados en las celdas editables del lightning-datatable.
     * @param {Object} event - Evento disparado al editar celdas en la tabla.
     */
   
    /**
     * Método para guardar los cambios editados en las celdas.
     */
    handleSave(event) {
        console.log('Draft Values:', JSON.stringify(this.draftValues)); // Verificar valores en consola
    
        const librosjeff =  event.detail.draftValues;  
        updateRecords({ libros: librosjeff })   // Para actualizar cambios, enviar los datos })

            .then(() => {
                this.showToast('Éxito', 'Los registros fueron actualizados correctamente.', 'success');
                this.draftValues = []; // Limpiar los valores después de guardar
                return refreshApex(this.libros);
            })
            .catch((error) => {
                this.showToast('Error', 'Hubo un problema al actualizar los registros: ' + error.body.message, 'error');
            });
    }
    

    /**
     * Método para mostrar mensajes de éxito, advertencia o error.
     */
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title,
            message,
            variant,
        });
        this.dispatchEvent(event);
    }
}
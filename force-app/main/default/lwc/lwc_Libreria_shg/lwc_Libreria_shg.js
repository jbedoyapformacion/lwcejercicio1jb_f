import { LightningElement, wire } from 'lwc';
import getlibros from '@salesforce/apex/lwc_clase_Libreria_shg.getlibros';
import updateRecord from '@salesforce/apex/lwc_clase_Libreria_shg.updateRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class LwcLibreriaShg extends LightningElement {
    data;
    columns = [
        { label: 'Nombre del libro', fieldName: 'Name', type: 'text', editable: false },
        { label: 'Sinopsis', fieldName: 'Sinopsis__c', type: 'text', editable: false },
        { label: 'Autor', fieldName: 'Autor__c', type: 'text', editable: false },
        { label: 'Fecha de publicación', fieldName: 'Fecha_de_publicacion__c', type: 'date', editable: false },
        { label: 'Género', fieldName: 'Genero__c', type: 'text', editable: false },
        { label: 'Número de copias', fieldName: 'Numero_de_copias__c', type: 'number', editable: true },
        {
            label: 'Reordenar',
            fieldName: 'reordenarDisplay',
            type: 'text',
            cellAttributes: {
                class: { fieldName: 'reordenarClass' }
            }
        }
    ];

    @wire(getlibros)
    wiredLibros(result) {
        this.wiredResult = result;
        if (result.data) {
            this.data = result.data.map(item => ({
                ...item,
                reordenarDisplay: item.Numero_de_copias__c < 5 ? 'Reordenar' : 'No Reordenar',
                reordenarClass: item.Numero_de_copias__c < 5 ? 'slds-text-color_error' : 'slds-text-color_success'
            }));
        } else if (result.error) {
            console.error("Error fetching data: ", result.error);
        }
    }

    handleCellChange(event) {
        const updatedRecord = event.detail.draftValues[0];

        updateRecord({ updatedRecord })
            .then(() => {
                this.showToast('Registro Actualizado');
                return refreshApex(this.wiredResult);
            })
            .catch(error => {
                this.showToast('Error al Actualizar el Registro', '', 'error');
                console.error("Error al Actualizar el Registro: ", error);
            });
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}
import { LightningElement, wire, track } from 'lwc';
import getLibros from '@salesforce/apex/librosdemo.getLibros';
import updateRecords from '@salesforce/apex/librosdemo.updateRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import deleteRow from '@salesforce/apex/librosdemo.deleteRow'; 
//import deleteBooks from '@salesforce/apex/librosdemo.deleteRecords';
const actions = [
    { label: 'Mantener', name: 'show_details' },
    { label: 'Eliminar', name: 'delete' },
];


export default class LibrosList extends LightningElement {
    @track libros = [];        // Almacena los datos obtenidos desde Apex
    @track draftValues = [];   // Almacena los valores editados
    @track error;              // Almacena errores

    columns = [
        { label: 'Nombre del libro', fieldName: 'Name' },
        { label: 'Autor', fieldName: 'Autor__c' },
        { label: 'Sinopsis', fieldName: 'Sinopsis__c' },
        { label: 'Fecha de Publicación', fieldName: 'Fecha_de_publicacion__c' },
        { label: 'Género', fieldName: 'Genero__c' },
        { label: 'Número de Copias', fieldName: 'Numero_de_copias__c', type: 'number', editable: true },
        { label: 'Reordenar', fieldName: 'Reordenar__c', type: 'boolean', editable: false },
        {
            type: 'action',
            typeAttributes: { rowActions: actions },
        },
        
    ];

   
   @wire(getLibros)// aqui tenemos que el decorador retorna un getter , con la misma nomenclatura que para @wire
   libros;


    handleSave(event) {
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
    
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        switch (actionName) {
            case 'delete':
                this.deleteRow(row);
                break;
            case 'show_details':
               
                break;
            default:
        }
    }
    //export default class ButtonWithIcon extends LightningElement {} **pendiente  por implementar
    deleteRow(row) {
      console.log(row);
      const id = row.Id;
      alert(row.Id);
    
    deleteRow({ libro: id })    // Para actualizar cambios, enviar los datos })

            .then(() => {
                this.showToast('Éxito', 'Los registros fueron Eliminados correctamente.', 'success');
                this.draftValues = []; // Limpiar los valores después de guardar
                return refreshApex(this.libros);
            })
            .catch((error) => {
                this.showToast('Error', 'Hubo un problema al eliminar los registros: ' + error.body.message, 'error');
            });
       
    }
    findRowIndexById(id) {
        let ret = -1;
        this.data.some((row, index) => {
            if (row.id === id) {
                ret = index;
                return true;
            }
            return false;
        });
        return ret;
    }

    showRowDetails(row) {
        this.record = row;
    }
}

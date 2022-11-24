import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Outlet } from '@modules/outlets/models';
import { OutletService } from '@modules/outlets/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-outlets',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './outlets.component.html',
    styleUrls: ['outlets.component.scss'],
})


export class OutletsComponent implements OnInit {
    
    title = 'Outlet List'
    isEdit = false;
    isDetail = false;
    isReadonly = false;
    outletForm: FormGroup | undefined;
    
    selectedOutlet:Outlet | undefined; 

    constructor(
        private formBuilder: FormBuilder,
        private outletService: OutletService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {}
    ngOnInit() {   

        this.outletForm = this.formBuilder.group({
            code: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            name: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            address: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            region: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          });

        this.spinner.show();
        this.outletService.loading$.subscribe(
            (isLoading) => {
                if(!isLoading) this.spinner.hide();
            }
        );
    }

    openModal(content: any, data: any) {
        this.modalService.open(content).result.then((result) => {

            if(result){
                this.outletService.deleteData(data?.id).subscribe(
                    (result) => {
                        if(result?.error == false){
                            this.outletService.loadData();
                        }
                    }
                );
            }
        });
    }

    add(){
        this.isReadonly = false;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'Add Outlet';

        this.outletForm?.reset();
    }
    back(){
        this.isDetail = false;
        this.title = 'Outlet List';
        this.outletService.loadData();
    }

    save(){
        this.isDetail = false;
        const data = this.outletForm?.value;
        data.status = 2;
        if(this.isEdit){
            if(this.selectedOutlet?.id != null){
                this.outletService.updateData(this.selectedOutlet.id, data).subscribe(
                    (result: any) => {
                        if(result.error == false){
                            this.outletService.loadData();                        
                        }
                    }
                );
            }
        }else{
            this.outletService.insertData(data).subscribe(
                (result: any) => {
                    if(result.error == false){
                        this.outletService.loadData();                        
                    }
                }
            );
        }
    }

    edit(data: Outlet){
        this.selectedOutlet = data;

        this.isReadonly = false;
        this.isEdit = true;
        this.isDetail = true;
        this.title = 'Edit Outlet';

        this.outletForm = this.formBuilder.group({
            code: new FormControl({value: data?.code, disabled: this.isReadonly}, [Validators.required]),
            name: new FormControl({value: data?.name, disabled: this.isReadonly}, [Validators.required]),
            address: new FormControl({value: data?.address, disabled: this.isReadonly}, [Validators.required]),
            region: new FormControl({value: data?.region, disabled: this.isReadonly}, [Validators.required]),
          });
    }

    view(data: Outlet){        
        this.isReadonly = true;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'View Outlet';

        this.outletForm = this.formBuilder.group({
            code: new FormControl({value: data?.code, disabled: this.isReadonly}, [Validators.required]),
            name: new FormControl({value: data?.name, disabled: this.isReadonly}, [Validators.required]),
            address: new FormControl({value: data?.address, disabled: this.isReadonly}, [Validators.required]),
            region: new FormControl({value: data?.region, disabled: this.isReadonly}, [Validators.required]),
          });
    }

}

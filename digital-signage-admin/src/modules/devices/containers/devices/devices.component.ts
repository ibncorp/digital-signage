import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Device } from '@modules/devices/models';
import { DeviceService } from '@modules/devices/services';
import { Outlet } from '@modules/outlets/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-devices',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './devices.component.html',
    styleUrls: ['devices.component.scss'],
})


export class DevicesComponent implements OnInit {
    
    title = 'Device List'
    isEdit = false;
    isDetail = false;

    isReadonly = false;
    deviceForm!: FormGroup;
    
    selectedDevice!: Device; 
 
    outlets: Outlet[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private deviceService: DeviceService,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {}
    
    ngOnInit() {
        this.spinner.show();

        this.deviceForm = this.formBuilder.group({
            code: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            name: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            outletId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            type: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            description: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          });

        this.deviceService.outlets$.subscribe(
            result => {
                this.outlets = result;                
            }
        )

        this.deviceService.loading$.subscribe(
          (isLoading) => {
            if(!isLoading) this.spinner.hide();
          }
        );
    }

    openModal(content: any, data: any) {
        this.modalService.open(content).result.then((result) => {

            if(result){
                this.deviceService.deleteData(data?.id).subscribe(
                    (result: { error: boolean; }) => {
                        if(result?.error == false){
                            this.deviceService.loadData();
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
        this.title = 'Add Device';

        this.deviceForm = this.formBuilder.group({
            code: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            name: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            outletId: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            type: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
            description: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          });
    }
    back(){
        this.isDetail = false;
        this.title = 'Device List';
        this.deviceService.loadData();
    }

    save(){
        this.isDetail = false;
        const data = this.deviceForm?.value;
        data.status = 2;

        console.log(data);
        
        if(this.isEdit){
            if(this.selectedDevice?.id != null){
                this.deviceService.updateData(this.selectedDevice.id, data).subscribe(
                    (result: any) => {
                        if(result?.error == false){
                            this.deviceService.loadData();                        
                        }
                    }
                );
            }

        }else{
            this.deviceService.insertData(data).subscribe(
                (result: any) => {
                    if(result.error == false){
                        this.deviceService.loadData();                        
                    }
                }
            );
        }
    }

    edit(data: Device){
        this.selectedDevice = data;

        this.isReadonly = false;
        this.isEdit = true;
        this.isDetail = true;
        this.title = 'Edit Device';

        this.deviceForm = this.formBuilder.group({
            code: new FormControl({value: data?.code, disabled: this.isReadonly}, [Validators.required]),
            name: new FormControl({value: data?.name, disabled: this.isReadonly}, [Validators.required]),
            outletId: new FormControl({value: data?.outlet?.id, disabled: this.isReadonly}, [Validators.required]),
            type: new FormControl({value: data?.type, disabled: this.isReadonly}, [Validators.required]),
            description: new FormControl({value: data?.description, disabled: this.isReadonly}, [Validators.required]),
          });
    }

    view(data: Device){        
        this.isReadonly = true;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'View Device';

        this.deviceForm = this.formBuilder.group({
            code: new FormControl({value: data?.code, disabled: this.isReadonly}, [Validators.required]),
            name: new FormControl({value: data?.name, disabled: this.isReadonly}, [Validators.required]),
            outletId: new FormControl({value: data?.outlet?.id, disabled: this.isReadonly}, [Validators.required]),
            type: new FormControl({value: data?.type, disabled: this.isReadonly}, [Validators.required]),
            description: new FormControl({value: data?.description, disabled: this.isReadonly}, [Validators.required]),
          });
    }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Media } from '@modules/media/models';
import { PictureService } from '@modules/media/services';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-picture',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './picture.component.html',
    styleUrls: ['picture.component.scss'],
})


export class PictureComponent implements OnInit {
    
    isEdit = false;
    isDetail = false;
    isReadonly = false;
    pictureForm!: FormGroup;
    
    selectedPicture!: Media;
    imageSrc!: string | ArrayBuffer | null;
    file: any;
    title: string = 'Picture List';

    uploadProgress!: number;

    testok = 'ok';

    constructor(
        private formBuilder: FormBuilder,
        private pictureService: PictureService,
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit() {
        this.pictureForm = this.formBuilder.group({
          name: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          description: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          });

        this.spinner.show();
        this.pictureService.loading$.subscribe(
          (isLoading) => {
            if(!isLoading) this.spinner.hide();
          }
        );
    }

    openModal(content: any, data: any) {

        this.modalService.open(content).result.then((result) => {

            if(result){
                this.pictureService.deleteData(data?.id).subscribe(
                    (result: any) => {
                        if(result?.error == false){
                          this.toastr.success(result?.message);
                          this.pictureService.loadData()
                        }else{
                          this.toastr.error(result?.message ?? 'Something went wrong!');
                        }
                    }
                );
            }
        });
    }


    add(){
        this.isDetail = true;      
        this.isEdit = false;

        this.imageSrc = '';
        
        this.title = 'Add Picture';

        this.pictureForm = this.formBuilder.group({
          name: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          description: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          });
    }
    back(){
        this.isDetail = false;

        this.title = 'Picture List';
    }

    save(){
        this.isDetail = false;

        const data = this.pictureForm?.value;

        console.log(data);

        const formData = new FormData();
        
        formData.append('displayName', data.name);
        formData.append('description', data.description);
        formData.append('status', '2');
        formData.append('type', '1');

        if (this.file){
          formData.append('file', this.file);
        }

        if(!this.isEdit){
          this.pictureService.insertData(formData).subscribe(
            (result: any) => {
              this.selectedPicture = result?.results?.data;
              this.pictureService.loadData();

              this.imageSrc = '';
              this.file = null;

              this.title = 'Picture List';
            }
          );
        }else{
          const id = this.selectedPicture.id;
          this.pictureService.updateData(id, formData)?.subscribe(
            (result: any) => {
              this.selectedPicture = result?.results?.data;
              this.pictureService.loadData();

              this.imageSrc = '';
              this.file = null;

              this.title = 'Picture List';
            }
          );
        }
    }

    edit(data: Media){
        this.selectedPicture = data;

        this.imageSrc =  environment.API_URL + 'media/download/' + this.selectedPicture.fileName;

        this.isReadonly = false;
        this.isEdit = true;
        this.isDetail = true;
        this.title = 'Edit Picture';

        this.pictureForm = this.formBuilder.group({
          name: new FormControl({value: data.displayName, disabled: this.isReadonly}, [Validators.required]),
          description: new FormControl({value: data.description, disabled: this.isReadonly}, [Validators.required]),
        });
    }

    view(data: Media){        
        this.selectedPicture = data;
        
        this.imageSrc = environment.API_URL + 'media/download/' + this.selectedPicture.fileName;

        this.isReadonly = true;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'View Picture';

        this.pictureForm = this.formBuilder.group({
          name: new FormControl({value: data?.displayName, disabled: this.isReadonly}, [Validators.required]),
          description: new FormControl({value: data?.description, disabled: this.isReadonly}, [Validators.required]),
        });
    }

    onFileSelected(event: any) {
      this.file = event.target.files[0];

      if(this.file){
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageSrc = reader.result;
          this.changeDetectorRef.detectChanges();   
        }  
        reader.readAsDataURL(this.file);
      }
    }
}

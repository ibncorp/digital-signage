import { HttpEventType } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Media } from '@modules/media/models';
import { VideoService } from '@modules/media/services';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'sb-video',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './video.component.html',
    styleUrls: ['video.component.scss'],
})


export class VideoComponent implements OnInit {
    
    isEdit = false;
    isDetail = false;
    isReadonly = false;
    videoForm!: FormGroup;
    
    selectedVideo!: Media;
    imageSrc!: string | ArrayBuffer | null;
    file: any;
    title: string = 'Video List';

    uploadProgress!: number;

    constructor(
        private formBuilder: FormBuilder,
        private videoService: VideoService,
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: NgbModal,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService
    ) {
    }

    ngOnInit() {
        this.videoForm = this.formBuilder.group({
          name: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          description: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
        });

        this.spinner.show();
        this.videoService.loading$.subscribe(
          (isLoading) => {
            if(!isLoading) this.spinner.hide();
          }
        );
    }

    openModal(content: any, data: any) {

        this.modalService.open(content).result.then((result) => {

            if(result){
                this.videoService.deleteData(data?.id).subscribe(
                    (result: any) => {
                        if(result?.error == false){
                          this.toastr.success(result?.message);
                          this.videoService.loadData();
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
        
        this.title = 'Add Video';

        this.videoForm = this.formBuilder.group({
          name: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          description: new FormControl({value: '', disabled: this.isReadonly}, [Validators.required]),
          });
    }
    back(){
        this.isDetail = false;

        this.title = 'Video List';
    }

    save(){
        const data = this.videoForm?.value;

        const formData = new FormData();
        
        formData.append('displayName', data.name);
        formData.append('description', data.description);
        formData.append('status', '2');
        formData.append('type', '2');

        if (this.file){
          formData.append('file', this.file);
        }

        const toastRef = this.toastr.info('','',{'disableTimeOut' : true}).toastRef;

        if(!this.isEdit){
          this.videoService.insertData(formData).subscribe(
            (event: any) => {

              console.log(event);
              if (event.type == HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));

                toastRef.componentInstance.message = "Uploading... (" + this.uploadProgress + "%)"
              }else if(event.type == HttpEventType.Response){

                this.toastr.clear();

                this.isDetail = false;

                this.uploadProgress = 0;

                const body = event.body;
                if(body?.error == true){
                  this.toastr.error(body?.message ?? 'Something went wrong!');
                }
  
                this.toastr.success(body?.message);
  
                this.selectedVideo = body.results.data;
  
                this.videoService.loadData();
  
                this.imageSrc = '';
                this.file = null;
  
                this.title = 'Video List';

                this.changeDetectorRef.detectChanges();
              }
            }
          );
        }else{
          const id = this.selectedVideo.id;
          this.videoService.updateData(id, formData)?.subscribe(
            (event: any) => {

              console.log(event);
              if (event.type == HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));

                toastRef.componentInstance.message = "Uploading... (" + this.uploadProgress + "%)"
              }else if(event.type == HttpEventType.Response){

                this.toastr.clear();

                this.isDetail = false;

                this.uploadProgress = 0;

                const body = event.body;
                if(body?.error == true){
                  this.toastr.error(body?.message ?? 'Something went wrong!');
                }
  
                this.toastr.success(body?.message);
  
                this.selectedVideo = body.results.data;
  
                this.videoService.loadData();
  
                this.imageSrc = '';
                this.file = null;
  
                this.title = 'Video List';

                this.changeDetectorRef.detectChanges();
              }
            }
          );
        }
    }

    edit(data: Media){
        this.selectedVideo = data;

        this.imageSrc = environment.API_URL +'media/download/' + this.selectedVideo.fileName;

        this.isReadonly = false;
        this.isEdit = true;
        this.isDetail = true;
        this.title = 'Edit Video';

        this.videoForm = this.formBuilder.group({
          name: new FormControl({value: data.displayName, disabled: this.isReadonly}, [Validators.required]),
          description: new FormControl({value: data.description, disabled: this.isReadonly}, [Validators.required]),
        });
    }

    view(data: Media){        
        this.selectedVideo = data;
        
        this.imageSrc = environment.API_URL + 'media/download/' + this.selectedVideo.fileName;

        this.isReadonly = true;
        this.isEdit = false;
        this.isDetail = true;
        this.title = 'View Video';

        this.videoForm = this.formBuilder.group({
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

import { Component } from '@angular/core';

import { FormBuilder, Validators, FormGroup, AbstractControl } from "@angular/forms";

import { MatDialog } from '@angular/material/dialog';
import { TagsComponent } from './tags/tags.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jsmediatags from "jsmediatags";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'songdewapp';
  removable = true;
  jsmediatags: any;
  constructor(private formBuilder: FormBuilder,
    public dialog: MatDialog, private _snackBar: MatSnackBar) {

  }

  files = [];

  registerForm: FormGroup = this.formBuilder.group({
    fullName: [, { validators: [Validators.required, this.fullNameValidation], updateOn: "change" }],
    email: [, {
      validators: [Validators.required, Validators.pattern],
      updateOn: "change",
    }],
    age: [, { validators: [Validators.max(120), Validators.required, Validators.min(18)], updateOn: "change" }],
  });

  submitForm() {
    console.log(this.registerForm);
  }

  logThis(data) {
    console.log(data);
  }


  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.onchange = () => {
      for (let index = 0; index < fileUpload.files.length; index++) {
        const file = fileUpload.files[index];
        file["tags"] = [];
        
        // console.log(this.files[index])
        // this.files[index].data.tags = []
        let addFile = 1;
        this.files.forEach((element, index) => {
          if(file.name === element.data.name)
            addFile = 0
        });
        if(addFile) {
        this.files.push({
          data: file, state: 'in',
          inProgress: false, progress: 0, canRetry: false, canCancel: true
        });
        } else {
          this._snackBar.open("Cannot add duplicate file", "Close", {
            duration: 2000,
          });
        }
      }
    };
    fileUpload.click();
    // console.log(this.files)
  }
  delete(index) {
    this.files.splice(index, 1);
  }
  addTags(fileObject) {
    console.log(fileObject)
    const dialogRef = this.dialog.open(TagsComponent, {
      data: {
        fileData: fileObject
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result.trim().length)
      if (result !== undefined && result.trim() !== "" && fileObject.data.tags.indexOf(result.trim()) === -1) {
        const tagsarray = fileObject.data.tags;
        tagsarray.push(result);
        fileObject.data.tags = tagsarray;
      } else {
        this._snackBar.open("Cannot add duplicate or empty tag ", "Close", {
          duration: 2000,
        });
      }
    });
  }

  remove(fileObject, tag): void {

    const tagsarray = fileObject.data.tags;
        


    const index = tagsarray.indexOf(tag);

    if (index >= 0) {
      tagsarray.splice(index, 1);
    }

    fileObject.data.tags = tagsarray;
  }

  fullNameValidation(controlName: AbstractControl) {
    if (controlName.value === null || controlName.value.trim() === "") {
      return { 'fullnamearrayInvalid': true }; // return object if the validation is not passed.
    } else {
      const fullnamearray = controlName.value.split(" ");
      if (fullnamearray.length !== 2)
        return { 'fullnamearrayInvalid': true };
      else {
        let returnvalue = 1;
        fullnamearray.forEach(element => {
          if (element.length === 0)
          returnvalue = 0;
        });
        if(!returnvalue)
        return { 'fullnamearrayInvalid': true };
      }
    }
    return null;
  }
  reset() {

    this.registerForm.reset();
    this.files = [];

  }
}

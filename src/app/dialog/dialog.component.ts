import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment'; // add this 1 of 4
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogdata, private formBuilder: FormBuilder, ) { }
  taskForm: FormGroup
  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z\s]{1,65}$')]],
      status: ['', [Validators.required]],
      expiry: ['', [Validators.required]],
    });
    if(this.dialogdata.dialogType=='updatetask'){
  this.taskForm.patchValue({
    name:this.dialogdata.task.name,
    status:this.dialogdata.task.status,
    expiry:this.dialogdata.task.expiry
  })
    }
  }
  closedialog() {
    this.dialogRef.close(false)
  }


  submitTask() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value)

    }
  }
  updateTask() {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value)

    }
  }
}

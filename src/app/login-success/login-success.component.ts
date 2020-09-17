import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service'
import { UserService } from '../user.service';
import { Router } from '@angular/router'
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {
  token: any;
  profile: any;
  taskList = []
  taskForm
  newtaskmsg
  deletetask: any;
  updatetask: any;
  isloading:boolean=true
  constructor(public socket: SocketService,
    private UserService: UserService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {

    this.token = JSON.parse(localStorage.getItem('usertoken'));
    if (this.token) {
      this.socectConnection();
      this.getProfile()
    } else {
      this.router.navigate(['/'])
    }
    this.getTasksList()
  }

  socectConnection() {
    this.socket.Connectsocket('connect');
    this.incomingSockets()
  }
  incomingSockets() {
    this.newtaskmsg = this.socket.newTaskAdded().subscribe(data => {
      if (data) {
        this.taskList.unshift(data)
        this.UserService.openSnackBar("New Task Added", "X")
      }
    })
    this.deletetask = this.socket.deleteTask().subscribe(data => {
      if (data) {
        var index = this.taskList.findIndex(x => x._id == data.taskid)
        if (index != -1) {
          this.taskList.splice(index, 1)
        }
      }
    })
    this.updatetask = this.socket.updateTask().subscribe(data => {
      if (data) {
        var index = this.taskList.findIndex(x => x._id == data._id)
        if (index != -1) {
          this.taskList.splice(index, 1)
          this.taskList.unshift(data)
        }
      }
    })
  }
  UpdateTask(task) {
    const Dialog = this.dialog.open(DialogComponent, {
      width: "650px",
      height: "450px",
      disableClose: false,
      autoFocus: true,
      panelClass: ['matDailogBox', 'customMatDailogBox', 'deletedialog'],
      data: { dialogType: "updatetask", title: "Update Task", task: task },
    });
    Dialog.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.UserService.updateTask(task._id, res).subscribe(data => {
          console.log(data);
          if (data) {
            this.UserService.openSnackBar("Task Updated SuccessFully", "x")
          }
        })
      }
    })
  }

  getProfile() {
    this.UserService.getProfile().subscribe((response: any) => {
      this.profile = response

    })
  }
  getTasksList() {
    this.UserService.getTasks().subscribe((res: any) => {
      this.isloading=false
      this.taskList = res
    })
  }

  deleteTask(task) {
    const Dialog = this.dialog.open(DialogComponent, {
      width: "400px",
      height: "250px",
      disableClose: false,
      autoFocus: true,
      panelClass: ['matDailogBox', 'customMatDailogBox', 'deletedialog'],
      data: { dialogType: "deletepop", title: "Delete Task" },
    });
    Dialog.afterClosed().subscribe(res => {
      if (res) {
        this.UserService.deleteTask(task._id).subscribe(data => {
          if (res) {
            this.UserService.openSnackBar("Task Removed Successfully", "X")
          }
        })
      }

    })
  }

  AddTask() {
    const Dialog = this.dialog.open(DialogComponent, {
      width: "650px",
      height: "450px",
      disableClose: false,
      autoFocus: true,
      panelClass: ['matDailogBox', 'customMatDailogBox', 'deletedialog'],
      data: { dialogType: "addtask", title: "Add Task" },
    });
    Dialog.afterClosed().subscribe(res => {
      console.log(res);
      if (res) {
        this.UserService.createTask(res).subscribe(data => {
          console.log(data);

        })
      }
    })
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/'])

  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if(this.socket)this.socket.disconnectsocket()
    this.newtaskmsg.unsubscribe()
  }
}
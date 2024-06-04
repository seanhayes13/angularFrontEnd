import { Component, OnInit } from '@angular/core';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import { UserService } from 'src/app/schoolManager/service/user.service';
import { AssignmentService } from '../../service/assignment.service';
import { AssignmentDto } from '../../common/assignment-dto';

@Component({
  selector: 'app-add-assignments',
  templateUrl: './add-assignments.component.html',
  styleUrls: ['./add-assignments.component.css']
})
export class SMAddAssignmentsComponent implements OnInit{
  assignmentForm: FormGroup;
  assignmentDto!: AssignmentDto;

  ngOnInit(): void {
  }

  constructor(public fb: FormBuilder, private smUserSvc: UserService,
    public assignmentSvc: AssignmentService){
    this.assignmentForm = this.fb.group({
      teacherId: smUserSvc.getLoggedInUserId(),
      assignments: this.fb.array([])
    });
  }

  assignments():FormArray{
    return this.assignmentForm.get("assignments") as FormArray
  }

  newAssignment():FormGroup{
    return this.fb.group({
      assignmentTitle:['',{
        validators: [ Validators.required],
      }],
      assignmentType:['',{
        validators: [ Validators.required],
      }],
      assignmentDueDate:['',{
        validators: [ Validators.required],
      }]
    })
  }

  addAssignment(){
    this.assignments().push(this.newAssignment());
  }

  removeAssignment(i:number){
    this.assignments().removeAt(i);
  }

  onSubmit(){
    this.assignmentDto = new AssignmentDto(this.assignmentForm.value);
    this.assignmentSvc.submitAssignments(this.assignmentDto);
  }
}
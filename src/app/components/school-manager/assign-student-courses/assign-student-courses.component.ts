import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AssignStudentDto } from 'src/app/common/school-manager/assign-student-dto';
import { CourseDetailDto } from 'src/app/common/school-manager/course-detail-dto';
import { StudentDetailDto } from 'src/app/common/school-manager/student-detail-dto';
import { UserDto } from 'src/app/common/school-manager/user-dto';
import { StaffService } from 'src/app/service/school-manager/staff.service';

@Component({
  selector: 'app-assign-student-courses',
  templateUrl: './assign-student-courses.component.html',
  styleUrls: ['./assign-student-courses.component.css']
})
export class AssignStudentCoursesComponent implements OnInit{
  courseList: CourseDetailDto[] = [];
  creditCount: number = 0;
  filteredCourses: CourseDetailDto[] = [];
  grades: string[] = ['7','8','9','10','11','12'];
  gradeSelect: string = '';
  originalStudentCourseList:CourseDetailDto[]=[];//this is the list that is pulled from the database
  showCourseSelect: boolean = false;
  showGradeSelect: boolean = true;
  showStudentSelectTable: boolean = false;
  showStudentSchedule: boolean = false;
  sortFlags: SortFlags = ['asc','asc','asc'];
  studentList: StudentDetailDto[] = [];
  studentSelect: StudentDetailDto | undefined;
  tempStudentList: StudentDetailDto[] = [];
  workingStudentCourseList:CourseDetailDto[]=[]; //this is the list that is displayed

  constructor(private staffSvc: StaffService, private toastr: ToastrService){}
  ngOnInit(): void {
    console.log('Loading student->courses');
    this.buildCourseList();
    this.buildTempStudentList();
  }

  async buildCourseList(){
    await this.staffSvc.getCourseDetails('middlehigh').subscribe(
      response => {
        response.forEach((cd) => {
          this.courseList.push(cd);
        })
      }
    )
    this.courseList.sort((a,b)=>a.period - b.period);
  }

  buildStudentList(){
    this.studentList = [];
    this.tempStudentList.filter((studentDetail)=>{
      if(studentDetail.student.gradeLevel == this.gradeSelect?.toString()) this.studentList.push(studentDetail);
    })
    if(this.studentList.length == 0){
      this.toastr.warning('No students in that grade found that are not enrolled in a course');
    } else {
      this.toastr.success('Student list populated');
    }
    this.showGradeSelect = false;
    this.showStudentSelectTable = true;
    this.showCourseSelect = false;
  }

  buildTempStudentList(){
    this.staffSvc.getAllMiddleHighStudents().subscribe(
      data=>{
        this.tempStudentList = data;
      }
    )
  }

  calculateEnrolledCredits(courses: CourseDetailDto[]){
    let result: number = 0;
    courses.forEach((c)=>{
      result += c.credit;
    })
    return result;
  }

  changeGradeLevel(){
    this.showGradeSelect = true;
    this.showStudentSelectTable = false;
    this.showCourseSelect = false;
  }

  changeStudent(){
    this.showGradeSelect = false;
    this.showStudentSelectTable = true;
    this.showCourseSelect = false;
  }

  filterCourses(course: CourseDetailDto){
    let tempList: CourseDetailDto[] = [];
    this.courseList.forEach((c) => {
      if(course.credit==1 || course.credit==0){
        if (c.period!=course.period && c.courseName != course.courseName) {
          tempList.push(c);
        } else {
          this.filteredCourses.push(c);
        }
      }
      if(course.credit==0.5){
        if(!((c.period==course.period && c.courseBlock=='FULL_YEAR') ||
        (c.period==course.period && c.courseBlock==course.courseBlock) ||
        c.courseName==course.courseName)){
          tempList.push(c);
        } else {
          this.filteredCourses.push(c);
        }
      }
    });
    this.courseList = tempList;
    this.courseList.sort((a,b)=>a.period - b.period);
  }

  getCourse(){
    this.workingStudentCourseList = [];
    this.staffSvc.getCoursesByStudentId(this.studentSelect!.student.userId).subscribe(
      response=>{
        response.forEach((c)=>{
          this.workingStudentCourseList.push(c);
          this.filterCourses(c);
        })
      }
    )
    this.sortStudentCourseList();
  }

  removeCourse(course: CourseDetailDto){
    let temp: CourseDetailDto[] = [];
    temp = this.workingStudentCourseList.filter((c)=>c.cptId!=course.cptId);
    this.workingStudentCourseList = temp;
    this.removeFilter(course);
    this.sortStudentCourseList();
  }

  removeFilter(course: CourseDetailDto){
    let tempListFilter: CourseDetailDto[] = [];
    let tempListAdd: CourseDetailDto[] = [];
    let tempWorking: CourseDetailDto[] = [];

    this.filteredCourses.forEach((c)=>{
      if(course.credit==1 || course.credit==0){
        if (c.period==course.period || c.courseName == course.courseName) {
          tempListAdd.push(c);
        } else {
          tempListFilter.push(c);
        }
      }
      if(course.credit==0.5){
        if(!((c.period==course.period && c.courseBlock=='FULL_YEAR') ||
        (c.period==course.period && c.courseBlock==course.courseBlock) ||
        c.courseName==course.courseName)){
          tempListAdd.push(c);
        } else {
          tempListFilter.push(c);
        }
      }
    });
    this.workingStudentCourseList.forEach((c)=>{
      if(c.cptId!=course.cptId) tempWorking.push(c);
    });
    this.workingStudentCourseList = tempWorking;
    this.filteredCourses = tempListFilter;
    this.courseList = this.courseList.concat(tempListAdd);
    this.courseList.sort((a,b)=>a.period - b.period);
  }

  selectCourse(course: CourseDetailDto){
      this.workingStudentCourseList.push(course);
      this.creditCount+=course.credit;
      this.filterCourses(course);
  }

  selectStudent(student: StudentDetailDto){
    this.studentSelect = student;
    this.showStudentSelectTable = false;
    this.showStudentSchedule = false;
    this.showCourseSelect = true;
    this.creditCount = 0;
    this.getCourse();
  }
  

  sortField(flag: string) {
    switch (flag) {
      case 'asc-firstName':
        this.studentList.sort((a, b) => a.student.firstName.localeCompare(b.student.firstName));
        this.sortFlags[0]='desc';
        break;
      case 'desc-firstName':
        this.studentList.sort((a, b) => b.student.firstName.localeCompare(a.student.firstName));
        this.sortFlags[0]='asc';
        break;
      case 'asc-lastName':
        this.studentList.sort((a, b) => a.student.lastName.localeCompare(b.student.lastName));
        this.sortFlags[1]='desc';
        break;
      case 'desc-lastName':
        this.studentList.sort((a, b) => b.student.lastName.localeCompare(a.student.lastName));
        this.sortFlags[1]='asc';
        break;
      case 'asc-creditCount':
        this.studentList.sort((a, b) => a.creditCount - b.creditCount);
        this.sortFlags[2]='desc';
        break;
      case 'desc-creditCount':
        this.studentList.sort((a, b) => b.creditCount - a.creditCount);
        this.sortFlags[2]='asc';
        break;
    }
  }
  
  sortStudentCourseList(){
    this.workingStudentCourseList.sort((a,b)=>a.period - b.period);
  }

  submit(){
    let cptIds: number[] = [];
    this.workingStudentCourseList.forEach((course)=>{
      cptIds.push(course.cptId);
    })
    let assignStudentDto: AssignStudentDto = new AssignStudentDto();
    assignStudentDto.cptIds = cptIds;
    assignStudentDto.studentIds.push(this.studentSelect!.student.userId);
    this.staffSvc.submitStudentAssignmentDto(assignStudentDto).subscribe(
      response =>{
        this.tempStudentList = [];
        this.buildTempStudentList();
        this.showCourseSelect = false;
        this.showGradeSelect = true;
        this.showStudentSelectTable = false;
        this.showStudentSchedule = false;
        this.gradeSelect = '';
      }
    )
  }
}

type SortFlags = [firstNameSort: string,
  lastNameSort: string,
  creditCountSort: string];
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FullCourseDetailDto } from 'src/app/common/school-manager/full-course-detail-dto';
import { StaffService } from 'src/app/service/school-manager/staff.service';

@Component({
  selector: 'app-view-students-by-course',
  templateUrl: './view-students-by-course.component.html',
  styleUrls: ['./view-students-by-course.component.css']
})
export class ViewStudentsByCourseComponent implements OnInit {
  fullCourseDetailList: FullCourseDetailDto[] = [];

  constructor(private staffSvc: StaffService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.buildList();
  }

  buildList() {
    this.staffSvc.getFullCourseDetails().subscribe(
      response => {
        this.fullCourseDetailList = response;
      }
    )
  }

  //sort course name
  sortCourse(){
    this.toastr.info("Sorting courses by course name feature coming soon");
  }

  //sort number of students enrolled
  sortByEnrollment(){
    this.toastr.info("Sorting courses by number of enrolled students coming soon");
  }
  //sort teacher last name
  sortByTeacherLastName(){
    this.toastr.info("Sorting courses by the teacher's last name coming soon");
  }

  teacherInfoString(dto: FullCourseDetailDto) {
    let result = "";
    result = dto.course.teacherFirstName + " " + dto.course.teacherLastName;
    result += " - " + dto.course.courseName + " - ";
    if (dto.course.credit >= 0) {
      if(dto.course.period != 0){
      result += dto.course.period + " - ";
      }
      if (dto.course.credit == 0.5) {
        if (dto.course.courseBlock == "FALL_SEMESTER") {
          result += "Fall Semester - ";
        }
        if (dto.course.courseBlock == "SPRING_SEMESTER") {
          result += "Spring Semester - ";
        }
      }
    }
    result += dto.students.length + " enrolled"
    return result;
  }

}

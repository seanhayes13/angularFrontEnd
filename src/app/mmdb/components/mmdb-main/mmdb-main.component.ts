import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Movie } from '../../common/movie';
import { MmdbService } from '../../service/mmdb.service';

@Component({
  selector: 'app-mmdb-main',
  templateUrl: './mmdb-main.component.html',
  styleUrls: ['./mmdb-main.component.css']
})
export class MmdbMainComponent implements OnInit{
  private baseUrl = environment.baseUrl+"/movies";
  private allUrl = this.baseUrl + "/all";
  movies: Movie[] = [];

  constructor(private mmdbSvc: MmdbService,
    private httpClient: HttpClient){}

  ngOnInit(): void {
    this.buildMovieList();
  }

  //rework this to set this.movies = this mmdbsvc.movies
  //or remove this completely and move the logic into ngoninit
  buildMovieList(){
    this.httpClient.get<Movie[]>(this.allUrl).subscribe(
      data=>{
        this.movies = data;
      }
    );
  }

  prepDetailsPage(movieID: number){
    this.mmdbSvc.buildMovieDetail(movieID);
  }
}
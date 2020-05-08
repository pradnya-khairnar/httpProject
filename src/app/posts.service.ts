import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpEventType
} from "@angular/common/http";
import { Posts } from "./posts.model";
import { map, catchError, tap } from "rxjs/operators";
import { Subject, throwError } from "rxjs";

@Injectable({ providedIn: "root" })
export class PostService {
  error = new Subject<String>();

  constructor(private http: HttpClient) {}

  sentAndStorePosts(title: string, content: string) {
    const postData: Posts = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        "https://udemyhttppk.firebaseio.com/posts.json",
        postData,
        {
          //optional argument to fetch full httpResponse
          observe: "response" //previously you were getting on body in response. now u'll get header as well.
        }
      ) //<set type>
      .subscribe(
        responseData => {
          console.log(responseData);
          window.alert("Post Sent");
        },
        error => {
          this.error.next(error.statusText);
        }
      );
  }
  fetchPosts() {
    //when there are multiple query params
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty");
    searchParams = searchParams.append("customParam", "params");
    return this.http
      .get<{ [key: string]: Posts }>(
        "https://udemyhttppk.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({ "custom-header": "hello" }), //set headers
          // params : new HttpParams().set('print','pretty')
          //add queryparams or append directly to url bt not good approach when there are mulyiple query params
          params: searchParams
        }
      ) // <sets type>
      .pipe(
        //pipe is method of observable which return observable & which transforms data.
        map(responseData => {
          // map is operator to funnel observable data i.e. to write all other logic
          const postsArray: Posts[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key }); // ... spread operator to get all key--value pairs
            }
          }
          return postsArray;
        }), // above code will transform js object into array with our key-values entered & encrypted firebase key
        catchError(errorRes => {
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete("https://udemyhttppk.firebaseio.com/posts.json", {
        observe: "events" 
      })
      .pipe(
        tap(events => {
          if (events.type === HttpEventType.Response) {
            console.log(events.body);
            //type is coded number for responses type, ex : sent=0, respponse=4
          }
        })
      );
  }
}

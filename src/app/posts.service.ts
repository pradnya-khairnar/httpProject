import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Posts } from "./posts.model";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class PostService {
  constructor(private http: HttpClient) {}

  sentAndStorePosts(title: string, content: string) {
    const postData: Posts = { title: title, content: content };
    this.http
      .post<{ name: string }>(
        "https://udemyhttppk.firebaseio.com/posts.json",
        postData
      ) //<set type>
      .subscribe(responseData => {
        console.log(responseData);
        window.alert("Post Sent");
      });
  }
  fetchPosts() {
   return this.http
      .get<{ [key: string]: Posts }>(
        "https://udemyhttppk.firebaseio.com/posts.json"
      ) // <sets type>
      .pipe(
        //pipe is method of observable which return observable & which transforms data.
        map(responseData => {
          // map is operator to funnel observable data i.e. to write all other logic
          const postsArray:Posts[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key }); // ... spread operator to get all key--value pairs
            }
          }
          return postsArray;
        }) // above code will transform js object into array with our key-values entered & encrypted firebase key
      );
  }

  deletePosts(){
      return this.http.delete("https://udemyhttppk.firebaseio.com/posts.json");
  }
}

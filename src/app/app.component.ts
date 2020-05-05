import { Component, OnInit } from "@angular/core";

import { Posts } from "./posts.model"
import { PostService } from './posts.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  loadedPosts :Posts[]= [];
  isFetching = false;

constructor(private postService:PostService) {}

  ngOnInit() {
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching =false;
      this.loadedPosts = posts;
    }); // to get data when page loads
  }

  onCreatePost(postData: Posts) {
    // Send Http request
    this.postService.sentAndStorePosts(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;
    this.postService.fetchPosts().subscribe(posts => {
      this.isFetching =false;
      this.loadedPosts = posts;
    });
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(()=>{
      this.loadedPosts=[];
    });
  }
}

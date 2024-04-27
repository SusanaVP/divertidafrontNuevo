import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { VideosComponent } from './components/videos/videos.component';
import { LoginComponent } from './components/login/login.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { BlogComponent } from './components/blog/blog.component';
import { EventsComponent } from './components/events/events.component';
import { RiddlesComponent } from './components/riddles/riddles.component';
import { StoryComponent } from './components/story/story.component';
import { ErrorComponent } from './components/error/error.component';
import { BlogEntryFormComponent } from './components/blog-entry-form/blog-entry-form.component';
import { ViewStoriesComponent } from './components/view-stories/view-stories.component';
import { SignInComponent } from './components/sign-in/sign-in.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'videos', component: VideosComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'blog', component: BlogComponent },
  { path: 'events', component: EventsComponent },
  { path: 'riddles', component: RiddlesComponent },
  { path: 'story', component: StoryComponent },
  { path: 'error', component: ErrorComponent },
  { path: 'blog-entry-form', component: BlogEntryFormComponent },
  { path: 'view-stories', component: ViewStoriesComponent },
  { path: 'sign-in', component: SignInComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

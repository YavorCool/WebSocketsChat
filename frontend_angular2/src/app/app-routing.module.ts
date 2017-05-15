import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from "./chat.component";
import {ChatsComponent} from "./chats.component";
const routes: Routes = [
  { path: '', redirectTo: '/chats', pathMatch: 'full' },
  { path:'chats', component: ChatsComponent },
  { path: 'chat/:token', component: ChatComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

}

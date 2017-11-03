import { Component } from '@angular/core';
import { JTaginputInterface } from './j-tag.interface';
import { JTagService } from './j-tag.service';

@Component({
  selector: 'j-tag',
  templateUrl: './j-tag.component.html',
  styleUrls: ['./j-tag.component.scss']
})
export class JTagComponent {
  public selectedTags: JTaginputInterface;
  constructor(public service: JTagService) {}
}

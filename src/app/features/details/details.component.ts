import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Movie } from '@models/movie.model';

@Component({
  selector: 'details-component',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [CommonModule]
})
export class DetailsComponent {
    @Input() movieSelected: Movie | null = null;
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DBItem } from 'src/app/data-access.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input({ required: true }) item!: DBItem;
}

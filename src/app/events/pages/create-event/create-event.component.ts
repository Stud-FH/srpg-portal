import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import { SrpgEvent, SrpgEventType, Region, Regions } from '../../domain/event';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { lastValueFrom, map, of, startWith, switchMap } from 'rxjs';
import { EventService } from '../../event.service';
import { combineLatest } from 'src/app/shared/util';
import * as moment from 'moment';
import { CurrentUserService } from 'src/app/users/current-user.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageSelectionDialogComponent } from '../../dialogs/image-selection-dialog/image-selection-dialog.component';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  readonly draft = new FormControl<(Partial<SrpgEvent> | null)[]>([null]);
  readonly type = new FormControl<SrpgEventType>(
    'One-Shot',
    Validators.required
  );

  Regions = Regions;
  dateFormat = moment.localeData().longDateFormat('L');
  readonly region = new FormControl<Region>(null!, Validators.required);
  readonly date = new FormControl<moment.Moment>(null!, Validators.required);
  readonly time = new FormControl<string>(null!, Validators.required);
  readonly duration = new FormControl<number>(4, [
    Validators.required,
    Validators.min(0),
  ]);
  readonly activity = new FormControl<string | undefined>(undefined);
  readonly gameSystem = new FormControl<string | undefined>(undefined);

  readonly basicsGroup = this.formBuilder.group({
    type: this.type,
    region: this.region,
    date: this.date,
    time: this.time,
    duration: this.duration,
    activity: this.activity,
    gameSystem: this.gameSystem,
  });

  locationOptions: string[] = [];
  readonly locationPrivate = new FormControl<boolean>(
    false,
    Validators.required
  );
  readonly location = new FormControl<string>('');

  readonly locationGroup = this.formBuilder.group({
    locationPrivate: this.locationPrivate,
    location: this.location,
  });

  activityOptions: string[] = [];
  gameSystemOptions: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly title = new FormControl<string>('', Validators.required);
  readonly description = new FormControl<string>('', Validators.required);
  readonly imageUrl = new FormControl<string>(
    { value: '', disabled: true },
    Validators.required
  );
  readonly tags = new FormControl<string[]>([]);

  readonly announcementGroup = this.formBuilder.group({
    title: this.title,
    description: this.description,
    imageUrl: this.imageUrl,
    tags: this.tags,
  });

  readonly participantsLimit = new FormControl<number>(5, [
    Validators.required,
    Validators.min(0),
  ]);
  readonly participantIds = new FormControl<number[]>([]);

  readonly peopleGroup = this.formBuilder.group({
    participantsLimit: this.participantsLimit,
    participantIds: this.participantIds,
  });

  readonly event = this.formBuilder.group({
    ...this.basicsGroup.controls,
    ...this.locationGroup.controls,
    ...this.announcementGroup.controls,
    ...this.peopleGroup.controls,
  });

  get currentUser$() {
    return this.currentUserService.currentUser$;
  }

  constructor(
    private readonly currentUserService: CurrentUserService,
    private readonly eventService: EventService,
    private readonly formBuilder: FormBuilder,
    private readonly matDialog: MatDialog,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.draft.valueChanges.subscribe((values) => {
      const draft = values ? values[0] : null;
      if (draft == null) {
        this.event.reset();
      } else {
        this.event.patchValue(draft);
      }
    });
    this.gameSystem.valueChanges
      .pipe(
        startWith(undefined),
        switchMap((value) =>
          combineLatest({
            input: of(value),
            suggestions: this.eventService.getGameSystems(value ?? ''),
          })
        ),
        map(({ input, suggestions }) =>
          input && suggestions.includes(input)
            ? suggestions
            : [...suggestions, input as string]
        )
      )
      .subscribe((options) => (this.gameSystemOptions = options));
  }

  typeIcon(type: SrpgEventType | null | undefined) {
    switch (type) {
      case undefined:
      case null:
        return 'crop_free';
      case 'Campaign':
        return 'history_edu';
      case 'One-Shot':
        return 'bolt';
      case 'Social':
        return 'group';
      default:
        throw new Error(`Unhandled case: ${type}`);
    }
  }

  openImageSelectionDialog() {
    const ref = this.matDialog.open(ImageSelectionDialogComponent);
    ref.afterClosed().subscribe((selection) => {
      if (selection != null) {
        this.imageUrl.setValue(selection);
      }
    });
  }

  addTag(event: MatChipInputEvent) {
    const tag = (event.value || '').trim();
    const current = this.tags.value ?? [];
    if (tag && !current.includes(tag)) {
      this.tags.setValue([...current, tag]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeTag(tag: string) {
    const current = this.tags.value ?? [];
    this.tags.setValue(current.filter((t) => t !== tag));
  }

  async publish() {
    if (this.event.invalid) {
      throw new Error('Form is invalid');
    }

    const draft = (this.draft.value ? this.draft.value[0] : null) ?? {};
    const event = {
      ...draft,
      ...this.event.value,
      organizerId: this.currentUserService.currentUserId,
    } as SrpgEvent;
    event.participantIds.push(this.currentUserService.currentUserId);
    const created = await lastValueFrom(this.eventService.createEvent(event));
    this.router.navigate(['/event', created.id]);
  }
}

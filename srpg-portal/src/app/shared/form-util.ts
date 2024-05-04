import { FormControl, FormGroup } from "@angular/forms";

type NoId<T> = Exclude<T, {id: any}>

export type TypedFormGroup<T> = FormGroup<{ [key in keyof NoId<T>]: FormControl<NoId<T>[key]> }>

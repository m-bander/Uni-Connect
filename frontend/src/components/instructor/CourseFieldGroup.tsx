import { ImageUploader } from "@/components/global/ImageUploader";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { YEARS } from "@/constants/student/student";
import { Controller, type Control } from "react-hook-form";

type CourseFieldGroupProps = {
  control: Control<{
    code: string;
    name: string;
    year: (typeof YEARS)[number];
    image_url?: string | undefined;
    department?:string;
    description?:string;
  }>;
  disableCode: boolean;
  handleImageChange: (file: File | undefined) => unknown;
};

export function CourseFieldGroup({
  control,
  disableCode = false,
  handleImageChange,
}: CourseFieldGroupProps) {
  return (
    <FieldGroup className="mb-5 max-h-[60vh] overflow-y-auto px-1">
      <FieldSet>
        <Controller control={control} name="department" render={({field})=><Field><FieldLabel htmlFor="department">Subject category</FieldLabel><Input {...field} id="department" list="subject-categories" placeholder="Choose or enter a category"/><datalist id="subject-categories">{["Computer Science","Software Engineering","Data Science & AI","Cybersecurity & Networks","Business & Management","Mathematics & Statistics","Design & Media","Languages & Communication","General Studies"].map(d=><option key={d} value={d}/>)}</datalist></Field>}/>
        <Controller control={control} name="description" render={({field})=><Field><FieldLabel htmlFor="course-description">Course overview</FieldLabel><Textarea {...field} id="course-description" placeholder="What will students learn?" maxLength={2000}/></Field>}/>
        <Field>
          <FieldLabel>Course Image: </FieldLabel>
          <Controller
            control={control}
            name="image_url"
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                handleChooseImage={handleImageChange}
                className="w-full h-50"
              />
            )}
          />
        </Field>
        <Controller
          control={control}
          name="code"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="code">Course Code: </FieldLabel>
              <Input
                {...field}
                disabled={disableCode}
                readOnly={disableCode}
                id="course_code"
                aria-invalid={fieldState.invalid}
                placeholder="CMPG102"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Course Name: </FieldLabel>
              <Input
                {...field}
                aria-invalid={fieldState.invalid}
                placeholder="Probability"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="year"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Course Year:</FieldLabel>
              <Select {...field} onValueChange={field.onChange}>
                <SelectTrigger id="year" aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {YEARS.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldSet>
    </FieldGroup>
  );
}

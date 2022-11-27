import { Expose } from "class-transformer";
import { IsDefined } from "class-validator";

// create Status enum: REJECTED, ACCEPTED, PENDING
export enum Status {
  REJECTED = "REJECTED",
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
}
export class updateSubscriptionDto {
  @IsDefined()
  @Expose()
  status: Status;
}

import { EventEmitter } from "events";
import { AppEvent } from "@/common/events/event-names";
import { RoleName } from "@/common/constants/roles";

export interface UserEventPayload {
  user: {
    id: string;
    name: string;
    email: string;
    role: RoleName;
  };
  ipAddress?: string;
  timestamp: string;
}

export interface LeadCreatedPayload {
  lead: {
    id: string;
    leadNumber: string;
    companyName?: string | null;
    contactName: string;
    email?: string | null;
    phone?: string | null;
    status: string;
  };
  creator: {
    id: string;
    name: string;
    email: string;
    role: RoleName;
  };
}

export interface LeadStatusChangedPayload {
  lead: {
    id: string;
    leadNumber: string;
    companyName?: string | null;
    contactName: string;
    status: string;
  };
  oldStatus: string;
  newStatus: string;
  actor: {
    id: string;
    name: string;
    email: string;
    role: RoleName;
  };
}

class TypedEventEmitter extends EventEmitter {
  public emitEvent<T = unknown>(event: AppEvent, payload: T): boolean {
    return this.emit(event, payload);
  }

  public onEvent<T = unknown>(event: AppEvent, listener: (payload: T) => void): this {
    return this.on(event, listener as (...args: unknown[]) => void);
  }
}

/** Global singleton event bus instance */
export const appEvents = new TypedEventEmitter();

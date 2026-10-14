import { z } from "zod";

// `meta` keeps these distinguishable in the JSON schema, which feeds the contract hash.
export const objectId = z
  .custom<{ toHexString(): string }>((v) => typeof v === "object" && v !== null && (v as { _bsontype?: string })._bsontype === "ObjectId")
  .meta({ bsonType: "objectId" });

export const bsonDate = z.date().meta({ bsonType: "date" });

import { type DataModel } from "@workspace/backend/dataModel";
import { mutation, query } from "@workspace/backend/server";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomQuery, zCustomMutation, zid as baseZid } from "convex-helpers/server/zod4";
import { type TableNamesInDataModel } from "convex/server";

export const zQuery = zCustomQuery(query, NoOp);
export const zMutation = zCustomMutation(mutation, NoOp);

export const zid = <TableName extends TableNamesInDataModel<DataModel>>(tableName: TableName) =>
  baseZid<DataModel, TableName>(tableName);

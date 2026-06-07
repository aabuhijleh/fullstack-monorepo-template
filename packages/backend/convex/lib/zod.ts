import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomQuery, zCustomMutation, zid as baseZid } from "convex-helpers/server/zod4";
import { type TableNamesInDataModel } from "convex/server";

import { type DataModel } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

export const zQuery = zCustomQuery(query, NoOp);
export const zMutation = zCustomMutation(mutation, NoOp);

export const zid = <TableName extends TableNamesInDataModel<DataModel>>(tableName: TableName) =>
  baseZid<DataModel, TableName>(tableName);

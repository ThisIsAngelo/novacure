import { createContext, useCallback, useState } from "react";
import { db } from "../utils/db-config";
import { RecordsTable, UsersTable } from "../utils/schema";
import { eq } from "drizzle-orm";

type Users = {
  id?: number;
  username: string;
  age: number;
  location: string;
  createdBy: string;
};

type Records = {
  id?: number;
  userId: number | 0;
  recordName: string;
  analysisResult: string;
  kanbanRecord: string;
  createdBy: string;
};

type RecordsToUpdate = {
  documentId: number;
  analysisResult: string;
  kanbanRecord: string;
};

type KanbanToUpdate = {
  recordId: number;
  kanbanRecord: string;
};

export type StateContextType = {
  users: Users[];
  setUsers: React.Dispatch<React.SetStateAction<Users[]>>;
  records: Records[];
  setRecords: React.Dispatch<React.SetStateAction<Records[]>>;
  currentUser: Users | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<Users | null>>;
  fetchUser: () => void;
  createUser: (userData: Users) => Promise<Users | null>;
  createRecord: (recordData: Records) => Promise<Records | null>;
  updateRecord: (recordData: RecordsToUpdate) => void;
  updateKanbanRecord: (kanbanData: KanbanToUpdate) => void;
  fetchUserRecords: (userEmail: string) => void;
  fetchUserByEmail: (email: string) => void;
};

export const StateContext = createContext<StateContextType | null>(null);

export const StateContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [users, setUsers] = useState<Users[]>([]);
  const [records, setRecords] = useState<Records[]>([]);
  const [currentUser, setCurrentUser] = useState<Users | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const result = await db.select().from(UsersTable).execute();
      setUsers(result);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }, []);

  const fetchUserByEmail = useCallback(async (email: string) => {
    try {
      const result = await db
        .select()
        .from(UsersTable)
        .where(eq(UsersTable.createdBy, email))
        .execute();
      if (result.length > 0) {
        setCurrentUser(result[0]);
      } else {
        setCurrentUser(null);
      }
    } catch (error) {
      console.log("Error fetching user by email:", error);
    }
  }, []);

  const createUser = useCallback(async (userData: Users) => {
    try {
      const newUser = await db
        .insert(UsersTable)
        .values(userData)
        .returning({
          id: UsersTable.id,
          username: UsersTable.username,
          age: UsersTable.age,
          location: UsersTable.location,
          createdBy: UsersTable.createdBy,
        })
        .execute();
      setUsers((prevUsers) => [...prevUsers, newUser[0]]);
      return newUser[0];
    } catch (error) {
      console.log("Error createing new user:", error);
      return null;
    }
  }, []);

  const fetchUserRecords = useCallback(async (userEmail: string) => {
    try {
      const result = await db
        .select()
        .from(RecordsTable)
        .where(eq(RecordsTable.createdBy, userEmail))
        .execute();
      setRecords(result);
    } catch (error) {
      console.log("Error fetching users:", error);
    }
  }, []);

  const createRecord = useCallback(
    async (recordData: Records): Promise<Records | null> => {
      try {
        const newRecord = await db
          .insert(RecordsTable)
          .values(recordData)
          .returning({
            id: RecordsTable.id,
            userId: RecordsTable.userId,
            recordName: RecordsTable.recordName,
            analysisResult: RecordsTable.analysisResult,
            kanbanRecord: RecordsTable.kanbanRecord,
            createdBy: RecordsTable.createdBy,
          })
          .execute();
        setRecords((prevRecords) => [...prevRecords, newRecord[0]]);
        return newRecord[0];
      } catch (error) {
        console.log("Error creating new record:", error);
        return null;
      }
    },
    []
  );

  const updateRecord = useCallback(async (recordData: RecordsToUpdate) => {
    try {
      const { documentId, ...dataToUpdate } = recordData;
      await db
        .update(RecordsTable)
        .set(dataToUpdate)
        .where(eq(RecordsTable.id, documentId))
        .returning();
    } catch (error) {
      console.log("Error updating records:", error);
      return null;
    }
  }, []);

  const updateKanbanRecord = useCallback(async (kanbanData: KanbanToUpdate) => {
    try {
      const {recordId, kanbanRecord} = kanbanData;
      await db
        .update(RecordsTable)
        .set({ kanbanRecord })
        .where(eq(RecordsTable.id, recordId))
        .returning();
    } catch (error) {
      console.log("Error updating kanban record:", error);
      return null;
    }
  }, []);

  return (
    <StateContext.Provider
      value={{
        users,
        setUsers,
        records,
        setRecords,
        currentUser,
        createUser,
        createRecord,
        updateRecord,
        updateKanbanRecord,
        setCurrentUser,
        fetchUser,
        fetchUserByEmail,
        fetchUserRecords,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

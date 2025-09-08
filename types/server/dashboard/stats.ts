export interface IStats {
    totalDocumentsInDatabase: number;
    totalDocumentsAddedLast24Hours: number;
    totalDocumentsAddedLastWeek: number;
    totalDocumentsAddedLastMonth: number;

    totalUniqueMoviesInDatabase: number;
    totalUniqueSeriesInDatabase: number;

    currentTaskInProcess: number;
    currentTaskInQueue: number;

    totalFailedTasks: number;
    totalFailedTasksLast24Hours: number;
    totalSuccessfulTasks: number;
    totalSuccessfulTasksLast24Hours: number;
}

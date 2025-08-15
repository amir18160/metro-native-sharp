export interface ISystemInfo {
    osDescription: string;
    frameworkDescription: string;
    cpuName: string;
    cpuCoreCount: number;
    cpuUsagePercentage: number;
    totalRamMb: number;
    usedRamMb: number;
    ramUsagePercentage: number;
    drives: IDriveInfo[];
}

export interface IDriveInfo {
    name: string;
    driveFormat: string;
    totalSizeGb: number;
    availableFreeSpaceGb: number;
    usedSpaceGb: number;
    usagePercentage: number;
}

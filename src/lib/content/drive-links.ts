/**
 * Kuttanad Flood Prediction System — source archive links.
 * The Google Drive folders where every collected dataset lives.
 * Links open only for accounts that have access to the shared folder.
 */

export const driveRoot = {
  label: "Data Collection — root archive",
  url: "https://drive.google.com/drive/folders/1KFljQTgqNZQGSfal-2d7y91BqQghsHsq",
};

export const driveCaveat =
  "Links open for accounts that have access to the shared Google Drive folder. Not every individual file is listed — the archive holds hundreds, including 12 IMD rainfall files of ~200 MB each and dated Sentinel scene folders.";

export interface DriveLink {
  label: string;
  url: string;
}

/** Folder links per inventory category id. */
export const categoryDriveLinks: Record<string, DriveLink[]> = {
  "flood-history": [
    { label: "Historical data", url: "https://drive.google.com/drive/folders/1unEobb2jpelfzSv-4yr0FfSbJzyl-I1R" },
    { label: "Kuttanad rain details — Jun–Sep", url: "https://drive.google.com/drive/folders/1Y1Ewn5Vht9-VC7j_FXEUwogVF90WIBFu" },
  ],
  hydrology: [
    { label: "CWC", url: "https://drive.google.com/drive/folders/104sE-Y37gujvv57qLO879eLkyCCXzUvt" },
    { label: "NWDP", url: "https://drive.google.com/drive/folders/1RkgvIeNJT6tAL8EmWbqn7_kw527UTB2T" },
    { label: "KSW", url: "https://drive.google.com/drive/folders/1gDruPL2frPsbfrm6PWCu-QORVk0LBxYW" },
    { label: "KSWA", url: "https://drive.google.com/drive/folders/1ejvk2Wq5dqwyDWXqRCrrGrpcDrCMd4bw" },
    { label: "IDRB — river gauge", url: "https://drive.google.com/drive/folders/1_urOt_TQpHKW2WCmxarq-DLuWfgq1scS" },
    { label: "NWIC", url: "https://drive.google.com/drive/folders/1KQMBQJP7UehiSL6xX7NSHfjszl7OX9Pn" },
    { label: "Kerala WRIS", url: "https://drive.google.com/drive/folders/1Wk8JD0LyDynIcttSf9ApaeUdaJtKCSQG" },
    { label: "River Basin", url: "https://drive.google.com/drive/folders/1-4gu9mDli4W2kAWduSSxKVPZeXsKI1m0" },
    { label: "Basin characteristics", url: "https://drive.google.com/drive/folders/1aZMPXTOuf3ndhx8Z_U4G4efh1Soazd4n" },
    { label: "Water level — cleaned", url: "https://drive.google.com/drive/folders/1u5oGs3ET_cWCbX5bRek7a3Li4G9jXFI4" },
    { label: "Rainfall — cleaned", url: "https://drive.google.com/drive/folders/1vMDSI5fInrXT8wgYBu4twyGvVWYvKftY" },
    { label: "Discharge — cleaned", url: "https://drive.google.com/drive/folders/1wmEoZPhD3FJJBYwOtONWs9vqf-4ef17Q" },
  ],
  weather: [
    { label: "NW3 weather — Open-Meteo + NASA", url: "https://drive.google.com/drive/folders/1pp26vNJNnxW-yP3DUPcrSJq_UIZExC5N" },
    { label: "Open-Meteo exports", url: "https://drive.google.com/drive/folders/1u83ZVgopRiqm6yWW9Dk5ArG-Ntnja-0D" },
    { label: "IMD Pune gridded data", url: "https://drive.google.com/drive/folders/1FZCa1nsX5rS8Km-v0qKDy4LCziRlwfRw" },
    { label: "Kuttanad rain details — Jun–Sep", url: "https://drive.google.com/drive/folders/1Y1Ewn5Vht9-VC7j_FXEUwogVF90WIBFu" },
  ],
  satellite: [
    { label: "Copernicus data", url: "https://drive.google.com/drive/folders/196zZmEpFE2o83l5bMdYl8KFaSI3GWWHN" },
    { label: "Kuttanad monitoring", url: "https://drive.google.com/drive/folders/1AFCAaGhjA7A77F6cvdTaPq1kuEmJcxMz" },
  ],
  terrain: [
    { label: "EarthExplorer — SRTM", url: "https://drive.google.com/drive/folders/1N-SNtLSv0eAqg9dU4-_8xPArkXcyQNnX" },
    { label: "Topography — SRTM DEM", url: "https://drive.google.com/drive/folders/1o4cwzBecQgCUnsK3MvTlKQKrAZ9kG9ai" },
    { label: "DEM results", url: "https://drive.google.com/drive/folders/1_pRVKkUTRU4IqLX58LFZVvctmFjiNpJx" },
    { label: "Simplified boundary", url: "https://drive.google.com/drive/folders/1Sz9-8hczKasqq0_Gqw9hBGZ1S2SYQcZY" },
  ],
  landuse: [
    { label: "LULC 2015–16 — Bhuvan", url: "https://drive.google.com/drive/folders/1-XEjse2eeXSTEFaDCdYxWleoUZzkXtwy" },
  ],
  reservoirs: [
    { label: "KSEB", url: "https://drive.google.com/drive/folders/1RHVYfxBtidFqbzNI2_wyd9AqzhNhyYv8" },
    { label: "Reservoirs — irrigation", url: "https://drive.google.com/drive/folders/10v0ZbyP1wE3_-S1DwsE42Z92qrV3R2q8" },
  ],
  literature: [
    { label: "Historical data", url: "https://drive.google.com/drive/folders/1unEobb2jpelfzSv-4yr0FfSbJzyl-I1R" },
    { label: "Kuttanad monitoring", url: "https://drive.google.com/drive/folders/1AFCAaGhjA7A77F6cvdTaPq1kuEmJcxMz" },
  ],
};

/** Per-dataset file links for the register's expanded rows. */
export const datasetDriveLinks: Record<string, DriveLink[]> = {
  "River water level — hourly": [
    { label: "Tadri–Kanyakumari, 1991–2020", url: "https://drive.google.com/file/d/1RGO0dt2WFU1wzfyhATK_U6SjYXw8F55M/view" },
    { label: "Tadri–Kanyakumari", url: "https://drive.google.com/file/d/1lMPXoGr3iNjqlWinujk-V0Kfn9l7os46/view" },
    { label: "Manual hourly West…Erna", url: "https://drive.google.com/file/d/1AG5bvVFgTMrElJZ8YzgkG9KZXg-TEQY4/view" },
    { label: "West flowing rivers — manual", url: "https://drive.google.com/file/d/1bX_I5uipdLmAaig9W10r_htiw0NvLOPG/view" },
    { label: "West flowing rivers — Pamba", url: "https://drive.google.com/file/d/1Z-1AxsnJMjw-UQ-xfDQjTRmZJgDoY5Yd/view" },
    { label: "West flowing rivers — series 1", url: "https://drive.google.com/file/d/1iM-t-OTLuIAIDlfWOlHnR1dp8FdWoUll/view" },
    { label: "West flowing rivers — series 2", url: "https://drive.google.com/file/d/1hxho3mBNU4xFvqTYdzD_BS8ReqO9ptoM/view" },
    { label: "West flowing rivers — copy", url: "https://drive.google.com/file/d/1u5UrzMy10ApCZeIFCbmhdOTezV4JoQ4w/view" },
    { label: "West flowing rivers — hr_manual", url: "https://drive.google.com/file/d/11aP6_ULb0qjD3Zm-xnYdzwk0-syHYn-J/view" },
    { label: "Manual hourly — CWC West", url: "https://drive.google.com/file/d/1W30CZAyB2-edN-oVkyXPaIuJH5MHjIwh/view" },
  ],
  "CWC rainfall series": [
    { label: "1961–1990", url: "https://drive.google.com/file/d/14qx6x9voqiuxo9q-P01lESAczj4WLbxo/view" },
    { label: "1991–2020", url: "https://drive.google.com/file/d/15VML48sQjQ32eaIS2mgn7sXYHBYKdUGg/view" },
    { label: "2021–2025", url: "https://drive.google.com/file/d/18YAFznyV6rILf_UOLHHNmibpkXM9Muv1/view" },
  ],
  "CWC daily river discharge": [
    { label: "1950–2000", url: "https://drive.google.com/file/d/1_FpHQE3eQg-02NDteLV5RDj4gPyo_DX6/view" },
    { label: "2001–2025", url: "https://drive.google.com/file/d/1F3ExNOZH3im4P_IIrnYL7XAqn1rMXjrN/view" },
    { label: "2026–2030", url: "https://drive.google.com/file/d/1_FSULsfLFMvkHHJffUZmRre2FDC3Lbpi/view" },
  ],
};

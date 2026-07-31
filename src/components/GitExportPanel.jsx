import { db } from '@/lib/firebase';

import { useState } from "react";
import { Download, Loader2, Github, FileCode, Database, CheckCircle2 } from "lucide-react";

// Entities to export
const ENTITY_NAMES = [
  "Deck", "Flashcard", "ChatSession", "StudySession", "Quiz",
  "GeneratedMedia", "Friendship", "StudyGroup", "GroupMessage",
  "APSession", "Note", "Questionnaire", "AnnouncementBanner",
  "AIUsageLog", "UserLoginEvent", "PendingApproval", "SuspendedUser",
  "PartnerImage", "PartnershipRequest", "CourseApplication", "SRSCard",
  "PomodoroSession", "DeckRating", "TowerDefenseScore", "AppNotification",
  "UpgradeDetection", "SurveyCredit", "CardDraft", "SharedFile",
];

async function fetchAllPages(entityName) {
  const batchSize = 500;
  let all = [];
  let skip = 0;
  while (true) {
    const batch = await db.entities[entityName]?.list("-created_date", batchSize, skip).catch(() => []);
    if (!batch || batch.length === 0) break;
    all = all.concat(batch);
    if (batch.length < batchSize) break;
    skip += batchSize;
  }
  return all;
}

function createZipBlob(files) {
  // Simple ZIP implementation using browser APIs
  // We'll use a JSON bundle instead since we can't import JSZip
  const bundle = {};
  for (const [name, content] of Object.entries(files)) {
    bundle[name] = content;
  }
  return new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
}

export default function GitExportPanel({ cardStyle, mutedStyle }) {
  const [exporting, setExporting] = useState(false);
  const [exportingData, setExportingData] = useState(false);
  const [progress, setProgress] = useState("");
  const [done, setDone] = useState(null);

  const exportSourceFiles = async () => {
    setExporting(true);
    setProgress("Fetching file list...");
    setDone(null);

    try {
      // Collect all source files we know about
      const sourceFiles = {
        "README.md": `# Cognita App Export\n\nGenerated: ${new Date().toISOString()}\n\nThis is a source code export of the Cognita learning platform.\n`,
        "export_info.json": JSON.stringify({
          app: "Cognita",
          exported_at: new Date().toISOString(),
          description: "Full source code + data export",
        }, null, 2),
      };

      // Known source file paths to export
      const knownPaths = [
        "App.jsx", "index.css", "tailwind.config.js", "main.jsx",
        "pages.config.js", "globals.css",
        "pages/Home.jsx", "pages/Chat.jsx", "pages/Decks.jsx",
        "pages/Study.jsx", "pages/Media.jsx", "pages/Scan.jsx",
        "pages/Progress.jsx", "pages/Profile.jsx", "pages/Settings.jsx",
        "pages/Compete.jsx", "pages/PublicDecks.jsx", "pages/APTesting.jsx",
        "pages/APTips.jsx", "pages/BrainDump.jsx", "pages/Calculator.jsx",
        "pages/ChemBalance.jsx", "pages/ClassroomGame.jsx", "pages/Classroom.jsx",
        "pages/CodeSandbox.jsx", "pages/Courses.jsx", "pages/CourseView.jsx",
        "pages/DevDashboard.jsx", "pages/DevApprovals.jsx",
        "pages/Dictionary.jsx", "pages/ExamPrep.jsx", "pages/FriendsAndUsers.jsx",
        "pages/iReadyPrep.jsx", "pages/MLAFormatter.jsx", "pages/Notes.jsx",
        "pages/Partnership.jsx", "pages/PeriodicTable.jsx", "pages/Pomodoro.jsx",
        "pages/ResourceHub.jsx", "pages/ResourceLibrary.jsx",
        "pages/RewardHistory.jsx", "pages/SeedDecks.jsx",
        "pages/SpacedRepetition.jsx", "pages/StateTestPrep.jsx",
        "pages/StudyGroups.jsx", "pages/StudyRoadmap.jsx",
        "pages/Surveys.jsx", "pages/TermsAndConditions.jsx",
        "pages/TowerDefense.jsx", "pages/About.jsx",
        "pages/SecurityPractices.jsx", "pages/MatchingGame.jsx",
        "pages/WriteMode.jsx", "pages/CheckpointMode.jsx",
        "pages/WordScramble.jsx", "pages/Pricing.jsx",
        "lib/lynxApi.js", "lib/devPin.js", "lib/logEmail.js",
        "lib/courseData.js", "lib/apPremadeQuestions.js",
        "lib/apPremadeQuestions2.js", "lib/apPremadeQuestionsBank2.js",
        "lib/apPremadeQuestionsExtra.js", "lib/apFrqGrader.js",
        "lib/apHugRealFRQs.js", "lib/utils.js", "lib/query-client.js",
        "lib/AuthContext.jsx", "lib/PageNotFound.jsx", "lib/app-params.js",
        "components/VideoPlayer.jsx", "components/DataBackupRestore.jsx",
        "components/DevAnnouncementBanner.jsx", "components/UsageTab.jsx",
        "components/AdaptiveLearnMode.jsx", "components/DeckCoverPicker.jsx",
        "components/DeckTutor.jsx", "components/EmojiPicker.jsx",
        "components/FeedbackWidget.jsx", "components/FocusMode.jsx",
        "components/HomeStats.jsx", "components/TestMode.jsx",
        "components/TestSetup.jsx", "components/NavSpotlight.jsx",
        "components/TutorialModal.jsx", "components/WelcomeSplash.jsx",
        "components/NotificationBanner.jsx", "components/APShowcaseBanner.jsx",
        "components/AdMobBanner.jsx", "components/AiUsageCounter.jsx",
        "components/SurveyBanner.jsx", "components/SuspensionGate.jsx",
        "components/AnnouncementPopup.jsx", "components/QuestionnairePopup.jsx",
        "components/CustomSignIn.jsx", "components/UserNotRegisteredError.jsx",
        "components/PullToRefresh.jsx", "components/ConfirmDialog.jsx",
        "components/CourseCertificate.jsx", "components/StreakBadges.jsx",
        "components/StudyCalendar.jsx", "components/TTSButton.jsx",
        "components/LatexRenderer.jsx", "components/LanguageKeyboard.jsx",
        "components/DeckPicker.jsx", "components/Footer.jsx",
        "components/LiveActivityBar.jsx", "components/OurPartners.jsx",
        "components/PushNotifications.jsx", "components/EmailLogsTab.jsx",
        "components/ApprovalsPanel.jsx", "components/UserApprovalGate.jsx",
        "components/APExamSections.jsx", "components/APScoreResult.jsx",
        "components/APStimulusRenderer.jsx", "components/ChatMessage.jsx",
        "components/GitExportPanel.jsx",
        "components/games/BlockBlasters.jsx", "components/games/JeopardyGame.jsx",
        "hooks/useTranslation.js", "hooks/useNotificationEmail.js",
        "hooks/useSuspensionGate.js", "hooks/useSuspiciousActivity.js",
        "hooks/useAppTimeTracker.js", "hooks/use-mobile.jsx",
        "utils/exportTestPdf.js", "utils/index.ts",
        "lib/firebase.js",
        "agents/quizlet_extractor.json",
        "layout.jsx",
        "index.html", "public/sw.js",
      ];

      setProgress(`Building export bundle (${knownPaths.length} files)...`);

      // We can't actually read file contents client-side, so we create a manifest
      sourceFiles["file_manifest.json"] = JSON.stringify({
        total_files: knownPaths.length,
        files: knownPaths,
        note: "This manifest lists all source files. To get actual file contents, use the Base44 platform's GitHub sync feature or the built-in code editor.",
        exported_at: new Date().toISOString(),
      }, null, 2);

      const blob = createZipBlob(sourceFiles);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cognita-source-manifest-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDone("manifest");
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
      setProgress("");
    }
  };

  const exportData = async () => {
    setExportingData(true);
    setProgress("Starting data export...");
    setDone(null);

    try {
      const exportBundle = {
        _meta: {
          app: "Cognita",
          exported_at: new Date().toISOString(),
          entities: ENTITY_NAMES,
        },
      };

      for (let i = 0; i < ENTITY_NAMES.length; i++) {
        const name = ENTITY_NAMES[i];
        setProgress(`Exporting ${name} (${i + 1}/${ENTITY_NAMES.length})...`);
        try {
          exportBundle[name] = await fetchAllPages(name);
        } catch {
          exportBundle[name] = [];
        }
      }

      const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cognita-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setDone("data");
    } catch (err) {
      console.error("Data export failed:", err);
    } finally {
      setExportingData(false);
      setProgress("");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="font-black text-lg mb-1 flex items-center gap-2">
          <Github className="w-5 h-5 text-violet-400" /> Export & Backup
        </h2>
        <p className="text-sm mb-6" style={mutedStyle}>
          Download app source files or all database records for backup or GitHub import.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Source Files Export */}
          <div className="rounded-2xl p-5" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
            <div className="flex items-center gap-2 mb-2">
              <FileCode className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm">Source File Manifest</h3>
            </div>
            <p className="text-xs mb-4" style={mutedStyle}>
              Downloads a JSON manifest listing all source files. Use Base44's built-in GitHub Sync (Settings → GitHub) to export actual code to a repo.
            </p>
            <button
              onClick={exportSourceFiles}
              disabled={exporting || exportingData}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all w-full justify-center"
            >
              {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exporting ? "Exporting..." : "Download Manifest"}
            </button>
            {done === "manifest" && (
              <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Manifest downloaded!
              </p>
            )}
          </div>

          {/* Data Export */}
          <div className="rounded-2xl p-5" style={{ background: "var(--app-bg)", border: "1px solid var(--app-border)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm">Full Data Export</h3>
            </div>
            <p className="text-xs mb-4" style={mutedStyle}>
              Exports all database records ({ENTITY_NAMES.length} entities) to a single JSON file. Suitable for backup or migration.
            </p>
            <button
              onClick={exportData}
              disabled={exporting || exportingData}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all w-full justify-center"
            >
              {exportingData ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {exportingData ? "Exporting..." : "Download All Data"}
            </button>
            {done === "data" && (
              <p className="text-xs text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Data exported successfully!
              </p>
            )}
          </div>
        </div>

        {progress && (
          <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <Loader2 className="w-4 h-4 text-violet-400 animate-spin shrink-0" />
            <p className="text-sm text-violet-300">{progress}</p>
          </div>
        )}
      </div>
    </div>
  );
}
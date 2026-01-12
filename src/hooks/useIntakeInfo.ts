import { useEffect, useState } from "react";

type IntakeInfo = {
  intakeName: string;
  intakeStartDate: string;
  intakeEndDate: string;
  isIntakeActive: boolean;
  isEvaluationActive: boolean;
};

export function useIntakeInfo() {
  const [intakeInfo, setIntakeInfo] = useState<IntakeInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntakeInfo = async () => {
      try {
        const response = await fetch("/api/intake");
        if (response.ok) {
          const data = await response.json();
          setIntakeInfo(data);
        }
      } catch (error) {
        console.error("Error fetching intake info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIntakeInfo();
  }, []);

  return { intakeInfo, loading };
}

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { addToast, openModal, setAiResult } from '@/store/slices/uiSlice';
import { updateTabRowEnrichment } from '@/store/slices/tabDataSlice';

export const useAiEnrichment = () => {
  const dispatch = useAppDispatch();
  const [isAiLoading, setIsAiLoading] = useState(false);

  const activeTabId = useAppSelector((state) => state.workspaces.activeTabId);
  const tabData = useAppSelector((state) =>
    activeTabId ? state.tabData.data[activeTabId] : null
  );

  const enrichRows = async (rowIds: string[]) => {
    if (rowIds.length === 0 || !activeTabId || !tabData) {
      dispatch(
        addToast({
          type: 'warning',
          title: 'No Selection',
          message: 'Select rows to generate emails for.',
        })
      );
      return;
    }

    setIsAiLoading(true);
    dispatch(
      addToast({
        type: 'info',
        title: 'AI Enrichment Started',
        message: `Generating emails for ${rowIds.length} row${rowIds.length > 1 ? 's' : ''}...`,
      })
    );

    // Process max 5 rows to save API quota
    const rowsToProcess = rowIds.slice(0, 5);

    try {
      for (const rowId of rowsToProcess) {
        const row = tabData.byId[rowId];
        if (!row) continue;

        const response = await fetch('/api/ai/enrich', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyName: row.companyName,
            personName: row.importedData, // Assuming importedData has name
            website: row.companyWebsite,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          
          dispatch(
            updateTabRowEnrichment({
              tabId: activeTabId,
              rowId,
              generatedEmail: data.content,
            })
          );

          // Set result for modal and open it (just showing the last one for now)
          dispatch(
            setAiResult({
              company: row.companyName,
              person: row.importedData,
              email: data.content,
            })
          );
          dispatch(openModal('enrichmentSuccess'));
        } else {
             throw new Error('API request failed');
        }
      }

      dispatch(
        addToast({
          type: 'success',
          title: 'AI Enrichment Complete',
          message: 'Emails generated successfully!',
        })
      );
    } catch (error) {
      console.error(error);
      dispatch(
        addToast({
          type: 'error',
          title: 'AI Enrichment Failed',
          message: 'Something went wrong.',
        })
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  return { enrichRows, isAiLoading };
};

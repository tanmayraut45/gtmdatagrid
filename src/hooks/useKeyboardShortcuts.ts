import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { openModal } from '@/store/slices/uiSlice';
import { setActiveTab } from '@/store/slices/workspacesSlice';
import { selectAllTabRows, deselectAllTabRows, deleteTabRows } from '@/store/slices/tabDataSlice';
import { addToast } from '@/store/slices/uiSlice';

export const useKeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  const activeTabId = useAppSelector(state => state.workspaces.activeTabId);
  const selectedIds = useAppSelector(state => activeTabId ? state.tabData.data[activeTabId]?.selectedIds : []);
  const tabs = useAppSelector(state => state.workspaces.tabs || []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      // Cmd+K -> Open Actions (Action Menu simulate or maybe command palette later)
      // For now let's map Cmd+K to Filter Panel which is similar to a command palette context
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        dispatch(openModal('filter'));
        dispatch(addToast({ type: 'info', title: 'Shortcut', message: 'Opened Filter Panel' }));
      }

      // Cmd+A -> Select All
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        if (activeTabId) {
          dispatch(selectAllTabRows(activeTabId));
           dispatch(addToast({ type: 'info', title: 'Shortcut', message: 'Selected All Rows' }));
        }
      }

      // Delete -> Delete Selected
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (selectedIds && selectedIds.length > 0 && activeTabId) {
          dispatch(deleteTabRows({ tabId: activeTabId, rowIds: selectedIds }));
          dispatch(deselectAllTabRows(activeTabId));
          dispatch(addToast({ type: 'success', title: 'Shortcut', message: `Deleted ${selectedIds.length} rows` }));
        }
      }

      // Tab Navigation (Left/Right Arrows + Option/Alt)
      if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
         e.preventDefault();
         const currentIndex = tabs.findIndex(t => t.id === activeTabId);
         if (currentIndex === -1) return;

         let nextIndex = currentIndex;
         if (e.key === 'ArrowRight') nextIndex = Math.min(currentIndex + 1, tabs.length - 1);
         if (e.key === 'ArrowLeft') nextIndex = Math.max(currentIndex - 1, 0);

         if (nextIndex !== currentIndex) {
            dispatch(setActiveTab(tabs[nextIndex].id));
         }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, activeTabId, selectedIds, tabs]);
};

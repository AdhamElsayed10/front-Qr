import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

function toDateInputValue(value) {
  if (!value) return '';
  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    return `${match[3]}-${match[2].padStart(2, '0')}-${match[1].padStart(2, '0')}`;
  }
  return '';
}

function buildInitialPublicPage(contractData) {
  const source = (contractData && contractData.publicPage) || {};
  return {
    issueDate: toDateInputValue(source.issueDate),
    expiryDate: toDateInputValue(source.expiryDate),
    validityDays: source.validityDays ?? '',
  };
}

export function ContractDataEditor({ contractData, onSave, saving }) {
  const [publicPage, setPublicPage] = useState(() => buildInitialPublicPage(contractData));

  const updateField = (field, value) => {
    setPublicPage((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ contractData: { publicPage } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Card className="p-4 space-y-3">
        <h3 className="heading text-sm">Public Page</h3>
        <p className="text-[11px] text-muted-foreground">
          Leave a field blank to use the global public-page settings.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3">
          <div>
            <label className="label" htmlFor="cd-public-issue-date">Issue date</label>
            <Input
              id="cd-public-issue-date"
              type="date"
              value={publicPage.issueDate || ''}
              onChange={(e) => updateField('issueDate', e.target.value)}
              className="h-9"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Blank = upload date</p>
          </div>
          <div>
            <label className="label" htmlFor="cd-public-expiry-date">Expiry date override</label>
            <Input
              id="cd-public-expiry-date"
              type="date"
              value={publicPage.expiryDate || ''}
              onChange={(e) => updateField('expiryDate', e.target.value)}
              className="h-9"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Blank = auto-calculated</p>
          </div>
          <div>
            <label className="label" htmlFor="cd-public-validity-days">Validity days override</label>
            <Input
              id="cd-public-validity-days"
              type="number"
              min="1"
              max="3650"
              value={publicPage.validityDays}
              onChange={(e) => updateField('validityDays', e.target.value)}
              className="h-9"
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Blank = global default</p>
          </div>
        </div>
      </Card>

      <div className="flex items-center justify-end pt-1">
        <Button type="submit" size="sm" disabled={saving}>
          <Save size={13} />
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </form>
  );
}

export default ContractDataEditor;

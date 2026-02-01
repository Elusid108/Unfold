import { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Save, X } from 'lucide-react';
import { Question } from '@/data/decks';

interface DeckBuilderProps {
  onSave: (name: string, description: string, questions: Question[]) => void;
  onBack: () => void;
}

export function DeckBuilder({ onSave, onBack }: DeckBuilderProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newFollowUp, setNewFollowUp] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddQuestion = () => {
    if (newQuestion.trim() && newFollowUp.trim()) {
      setQuestions(prev => [...prev, { q: newQuestion.trim(), followUp: newFollowUp.trim() }]);
      setNewQuestion('');
      setNewFollowUp('');
      setShowAddForm(false);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (name.trim() && description.trim() && questions.length > 0) {
      onSave(name.trim(), description.trim(), questions);
    }
  };

  const canSave = name.trim() && description.trim() && questions.length > 0;

  return (
    <div className="space-y-4 flex flex-col h-full overflow-hidden">
      <button
        onClick={onBack}
        className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors uppercase tracking-widest flex-shrink-0"
      >
        <ArrowLeft className="w-3 h-3" /> Back
      </button>

      <div className="text-center mb-2 flex-shrink-0">
        <h2 className="text-2xl font-light text-card-foreground mb-1">Create Custom Deck</h2>
        <p className="text-muted-foreground text-sm">
          Build your own set of questions.
        </p>
      </div>

      <div className="space-y-3 flex-shrink-0">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1 block">
            Deck Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., First Date Questions"
            className="w-full p-3 rounded-xl bg-card/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>

        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1 block">
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Light questions to break the ice"
            className="w-full p-3 rounded-xl bg-card/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex justify-between items-center mb-2 flex-shrink-0">
          <label className="text-xs text-muted-foreground uppercase tracking-widest">
            Questions ({questions.length})
          </label>
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 font-bold"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          )}
        </div>

        {showAddForm && (
          <div className="bg-card/50 border border-primary/30 rounded-xl p-3 mb-3 space-y-2 flex-shrink-0">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Main question..."
              className="w-full p-2 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
              autoFocus
            />
            <input
              type="text"
              value={newFollowUp}
              onChange={(e) => setNewFollowUp(e.target.value)}
              placeholder="Follow-up / Deep Dive..."
              className="w-full p-2 rounded-lg bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim() || !newFollowUp.trim()}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Question
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewQuestion('');
                  setNewFollowUp('');
                }}
                className="p-2 rounded-lg bg-secondary hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2">
          {questions.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              No questions yet. Add your first one!
            </p>
          ) : (
            questions.map((q, idx) => (
              <div key={idx} className="bg-card/50 border border-border rounded-xl p-3 group">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-card-foreground leading-relaxed">{q.q}</p>
                    <p className="text-xs text-primary/70 mt-1 italic">"{q.followUp}"</p>
                  </div>
                  <button
                    onClick={() => handleRemoveQuestion(idx)}
                    className="p-1 hover:bg-destructive/20 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={!canSave}
        className={`w-full py-3 rounded-xl font-bold tracking-widest text-sm shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0 ${
          canSave
            ? 'deck-gradient-reset text-primary-foreground hover:shadow-primary/40'
            : 'bg-muted text-muted-foreground cursor-not-allowed'
        }`}
      >
        <Save className="w-4 h-4" /> SAVE DECK
      </button>
    </div>
  );
}

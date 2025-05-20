"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import JoditEditor from "jodit-react";
import { FaCommentAlt, FaRegCommentAlt } from "react-icons/fa";

export default function MyFeed({ id, initialContent, onDelete, onUpdate }) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [editContent, setEditContent] = useState(initialContent);

  const handleDelete = () => {
    onDelete(id);
  };

  const handleSave = () => {
    onUpdate(id, editContent);
    setContent(editContent);
    setIsEditOpen(false);
  };

  const handleEditClick = () => {
    // Close dropdown menu first, then open dialog
    setTimeout(() => {
      setIsEditOpen(true);
    }, 100);
  };

  return (
    <Card className="p-3 mx- relative">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-lg">Exciting Things Are Coming To</h4>
          <p className="text-sm text-gray-500">@DebraAurich · 5 hours ago</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              ⋮
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleEditClick}>Edit</DropdownMenuItem>
            <DropdownMenuItem onSelect={handleDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CardContent className="pt-4">
        <div dangerouslySetInnerHTML={{ __html: content }} />
        <div className="flex space-x-4 mt-4 text-gray-500">
          <div className="flex items-center space-x-1">
            <span>❤️</span> <span>20</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>
              <FaRegCommentAlt />
            </span>{" "}
            <span>10</span>
          </div>
        </div>
      </CardContent>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <JoditEditor
            value={editContent}
            onChange={(newContent) => setEditContent(newContent)}
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
